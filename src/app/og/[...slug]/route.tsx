import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from '@/lib/constants';
import { indexablePaths } from '@/lib/legacy-content';
import { SOCIAL_CARD_SIZE, socialCardFor, socialCardPath } from '@/lib/social-card';

/**
 * Branded share images (1200×630 PNG), prerendered at build for every
 * indexable page: logo-blue panel with the page title and hotline, plus the
 * page's own photo. URL contract: socialCardPath() in src/lib/social-card.ts.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return indexablePaths.map((path) => ({ slug: socialCardPath(path).slice('/og/'.length).split('/') }));
}

/** Be Vietnam Pro (Vietnamese diacritics) as TrueType — the same Google Fonts family next/font serves. */
async function loadFont(weight: 700 | 800) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@${weight}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`Be Vietnam Pro ${weight}: Google Fonts returned no TrueType source`);
  return (await fetch(url)).arrayBuffer();
}

let fonts: Promise<ArrayBuffer[]> | undefined;

async function dataUri(publicPath: string) {
  const file = await readFile(join(process.cwd(), 'public', decodeURI(publicPath)));
  const type = extname(publicPath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
  return `data:${type};base64,${file.toString('base64')}`;
}

const titleSize = (title: string) => (title.length <= 36 ? 64 : title.length <= 60 ? 54 : title.length <= 90 ? 44 : 38);
const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text);

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = `/${slug.join('/').replace(/\.png$/, '')}`;
  const card = socialCardFor(path === '/index' ? '/' : path);
  if (!card) return new Response('Not found', { status: 404 });

  fonts ??= Promise.all([loadFont(700), loadFont(800)]);
  const [bold, extraBold] = await fonts;
  const [logo, photo] = await Promise.all([dataUri(SITE_CONFIG.logo), dataUri(card.image)]);
  const title = clip(card.title, 110);

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', fontFamily: 'Be Vietnam Pro', backgroundColor: '#0e64a8' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 720, height: '100%', padding: '52px 56px 48px', color: '#ffffff', backgroundImage: 'linear-gradient(120deg, #0b5a98 0%, #1270b8 100%)' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', padding: '12px 20px', borderRadius: 16, backgroundColor: '#ffffff' }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
              <img src={logo} width={219} height={64} alt="" />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', fontSize: 22, fontWeight: 700, lineHeight: 1.4, letterSpacing: 1.5, color: '#fff4cc' }}>
              <div style={{ flexShrink: 0, width: 36, height: 4, marginTop: 13, marginRight: 14, borderRadius: 2, backgroundColor: '#f5b800' }} />
              {clip(card.eyebrow, 48).toLocaleUpperCase('vi')}
            </div>
            <div style={{ display: 'flex', marginTop: 18, fontSize: titleSize(title), fontWeight: 800, lineHeight: 1.12, letterSpacing: -1 }}>{title}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 22px', borderRadius: 12, fontSize: 30, fontWeight: 800, color: '#0a3d6b', backgroundColor: '#f5b800' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0a3d6b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 12 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {SITE_CONFIG.hotline}
            </div>
            <div style={{ display: 'flex', marginLeft: 22, fontSize: 24, fontWeight: 700, color: '#e6f2fc' }}>vantaiphuongvy.com</div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img src={photo} width={480} height={630} alt="" style={{ objectFit: 'cover' }} />
      </div>
    ),
    {
      ...SOCIAL_CARD_SIZE,
      fonts: [
        { name: 'Be Vietnam Pro', data: bold, weight: 700, style: 'normal' },
        { name: 'Be Vietnam Pro', data: extraBold, weight: 800, style: 'normal' },
      ],
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    },
  );
}
