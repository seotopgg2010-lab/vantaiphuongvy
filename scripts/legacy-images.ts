/**
 * Responsive variants for article images in the cleaned legacy corpus.
 *
 * Generated at build time as plain static WebP files under public/_img (content-
 * hashed names, cached immutable), so they cost no runtime image transformation.
 * The <img src> keeps the original /wp-content/uploads URL (image-search parity,
 * image sitemap unchanged); browsers pick a right-sized variant from srcset.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Rendered width of the article column (.prose-pv max-width 46rem; 1.25rem side padding on phones). */
export const ARTICLE_IMAGE_SIZES = '(min-width: 768px) 736px, calc(100vw - 2.5rem)';
const VARIANT_WIDTHS = [480, 768, 1080];
const MAX_WIDTH = 1600;
const QUALITY = 72;
/** Part of every file name's hash: changing the encoding settings yields new, uncached URLs. */
const VARIANT_SETTINGS = `webp-q${QUALITY}-w${VARIANT_WIDTHS.join('.')}-max${MAX_WIDTH}-rotate`;
const CONCURRENCY = 4;

export type ArticleImage = { width: number; height: number; srcset?: string };

type Sharp = typeof import('sharp').default;

/**
 * sharp ships with Next.js as an optional dependency. Locally the corpus can fall back to plain
 * <img> tags; a CI or Vercel build stops instead of shipping images without size or srcset.
 */
async function loadSharp(): Promise<Sharp | null> {
  try {
    return (await import('sharp')).default;
  } catch (error) {
    if (process.env.CI || process.env.VERCEL) throw new Error(`legacy-images: sharp is required for article images (${(error as Error).message})`);
    console.warn('legacy-images: sharp is unavailable, article images keep their original files only');
    return null;
  }
}

/** Intrinsic size (EXIF-oriented) and, for raster photos, a WebP srcset for each article image path. */
export async function buildArticleImages(sources: Iterable<string>, root: string): Promise<Map<string, ArticleImage>> {
  const images = new Map<string, ArticleImage>();
  const sharp = await loadSharp();
  if (!sharp) return images;
  const queue = [...new Set(sources)];
  const current = new Set<string>();

  const describe = async (src: string): Promise<ArticleImage | null> => {
    const path = decodeURI(src);
    const file = join(root, 'public', path);
    if (!existsSync(file)) return null;
    const input = readFileSync(file);
    const meta = await sharp(input).metadata();
    if (!meta.width || !meta.height) return null;
    const rotated = (meta.orientation ?? 1) >= 5;
    const image: ArticleImage = { width: rotated ? meta.height : meta.width, height: rotated ? meta.width : meta.height };
    // Animated images and vector files stay as they are.
    if (!/\.(jpe?g|png|webp)$/i.test(path) || (meta.pages ?? 1) !== 1) return image;
    const hash = createHash('sha1').update(input).update(VARIANT_SETTINGS).digest('hex').slice(0, 8);
    const base = path.replace(/^\/wp-content\/uploads\//, '').replace(/\.[^./]+$/, '');
    const widths = [...new Set([...VARIANT_WIDTHS.filter((width) => width < image.width), Math.min(image.width, MAX_WIDTH)])].sort((a, b) => a - b);
    const candidates: string[] = [];
    for (const width of widths) {
      const url = `/_img/${base}-${width}.${hash}.webp`;
      const target = join(root, 'public', url);
      current.add(target);
      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true });
        await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(target);
      }
      candidates.push(`${encodeURI(url)} ${width}w`);
    }
    return { ...image, srcset: candidates.join(', ') };
  };

  const worker = async () => {
    for (let src = queue.shift(); src; src = queue.shift()) {
      // A damaged or unsupported upload keeps its plain <img> (the corpus test still reports it)
      // instead of failing every build.
      try {
        const image = await describe(src);
        if (image) images.set(src, image);
      } catch (error) {
        console.warn(`legacy-images: ${decodeURI(src)} skipped (${(error as Error).message})`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Drop variants from earlier settings or removed images so the folder only holds what the corpus references.
  const folder = join(root, 'public', '_img');
  for (const entry of existsSync(folder) ? readdirSync(folder, { recursive: true, encoding: 'utf8' }) : []) {
    const file = join(folder, entry);
    if (!current.has(file) && statSync(file).isFile()) rmSync(file);
  }
  return images;
}

/** Adds intrinsic width/height (no layout shift) and srcset/sizes to the article's <img> tags; src is untouched. */
export function applyArticleImages(html: string, images: Map<string, ArticleImage>): string {
  return html.replace(/<img ([^>]*?)\s*\/?>/g, (tag, attributes: string) => {
    const src = attributes.match(/(?:^|\s)src="([^"]+)"/)?.[1];
    const image = src ? images.get(src) : undefined;
    if (!image) return tag;
    let attrs = attributes;
    if (!/(?:^|\s)width="/.test(attrs) || !/(?:^|\s)height="/.test(attrs)) {
      // Keep a display width WordPress set on purpose; the height follows the file's aspect ratio.
      const width = Number(attrs.match(/(?:^|\s)width="(\d+)"/)?.[1]) || image.width;
      attrs = attrs.replace(/\s(?:width|height)="[^"]*"/g, '');
      attrs += ` width="${width}" height="${Math.round((width * image.height) / image.width)}"`;
    }
    if (image.srcset) attrs += ` srcset="${image.srcset}" sizes="${ARTICLE_IMAGE_SIZES}"`;
    return `<img ${attrs} />`;
  });
}
