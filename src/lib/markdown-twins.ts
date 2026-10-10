import bodies from '@/legacy-content/legacy-markdown.json';
import { SITE_CONFIG, ZALO_URL } from './constants';
import { WAREHOUSES, type Warehouse, warehouseArea, warehousesFor } from './warehouses';
import { cargoItems, getLegacyByPath, homeFaq, indexablePaths, latestPostDate, legacyPosts, routesByRegion, truckItems } from './legacy-content';
import { displayTitle, ratingScore } from './legacy-render';
import type { LegacyEntry, LegacyRating } from './legacy-types';
import { ABOUT, BLOG_PAGE, COMMITMENTS, HERO, HERO_LEADS, OFFER, PRESS, PROCESS_STEPS, SERVICES, SERVICES_LEAD, STATS, TESTIMONIALS } from './marketing';
import { markdownPathFor } from './markdown-paths';
import { canonicalUrl } from './seo';
import { getSiteUrl } from './site';

/**
 * Markdown twins of every indexable page, plus llms.txt / llms-full.txt.
 * Everything is derived from the same sources the HTML pages render (legacy
 * corpus, SITE_CONFIG, marketing copy), so the two cannot drift apart.
 */

const MARKDOWN_BODIES = bodies as Record<string, string>;

const day = (iso?: string) => iso?.slice(0, 10);
const markdownUrl = (path: string) => `${getSiteUrl()}${markdownPathFor(path)}`;
/** Site-relative links and images in the corpus become absolute for off-site readers. */
const absolutize = (markdown: string) => markdown.replace(/\]\(\//g, `](${getSiteUrl()}/`);
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Markdown/text responses stay crawlable but never compete with the HTML page in search results. */
export function markdownResponse(body: string, contentType = 'text/markdown; charset=utf-8') {
  return new Response(body, {
    headers: { 'Content-Type': contentType, 'X-Robots-Tag': 'noindex', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}

/** Page paths (no trailing slash, "/" for home) that have a markdown twin — the same set as the sitemap. */
export const TWIN_PATHS = indexablePaths;

function header({ title, description, path, updated, published, author, rating }: { title: string; description?: string; path: string; updated?: string; published?: string; author?: string; rating?: LegacyRating }) {
  return [
    `# ${title}`,
    description && `> ${oneLine(description)}`,
    [
      `- Trang gốc: ${canonicalUrl(path)}`,
      author && `- Tác giả: ${author}`,
      published && `- Ngày đăng: ${day(published)}`,
      updated && `- Cập nhật: ${day(updated)}`,
      rating && `- Đánh giá: ${ratingScore(rating)} (${rating.count} bình chọn)`,
      `- Đơn vị: ${SITE_CONFIG.companyName} — hotline ${SITE_CONFIG.hotline}`,
    ].filter(Boolean).join('\n'),
  ].filter(Boolean).join('\n\n');
}

function contactSection(heading = '## Liên hệ Vận tải Phương Vy') {
  return [
    heading,
    [
      `- Hotline: ${SITE_CONFIG.hotlines.join(' · ')}`,
      ...SITE_CONFIG.salesContacts.map((contact) => `- Kinh doanh ${contact.name}: ${contact.phones.join(' – ')}`),
      `- Điện thoại bàn: ${SITE_CONFIG.landline}`,
      `- Zalo: ${SITE_CONFIG.zalo} (${ZALO_URL})`,
      `- Email: ${SITE_CONFIG.emails.join(', ')}`,
      `- Trụ sở: ${SITE_CONFIG.address}`,
      ...SITE_CONFIG.yards.map((yard) => `- ${yard.region}: ${yard.address}`),
      `- Giờ làm việc: ${SITE_CONFIG.businessHours}, tất cả các ngày (kể cả ngày lễ)`,
      `- Mã số thuế: ${SITE_CONFIG.taxId}`,
      `- Báo giá: ${canonicalUrl('/lien-he')}#bao-gia`,
    ].join('\n'),
  ].join('\n\n');
}

const warehouseLines = (items: readonly Warehouse[]) => items.map((warehouse) => `- **${warehouse.label}:** ${warehouse.address}`).join('\n');

const pageLink = (item: LegacyEntry, label = item.label) => `[${label}](${canonicalUrl(item.path)})`;

function homeMarkdown() {
  const home = getLegacyByPath('/');
  const faq = homeFaq();
  return [
    header({ title: `${SITE_CONFIG.name} — ${HERO.title}`, description: home?.seo.description || SITE_CONFIG.description, path: '/', updated: home?.modified }),
    `*${SITE_CONFIG.slogan}*`,
    HERO.lead,
    HERO.points.map((point) => `- ${point}`).join('\n'),
    '## Số liệu nổi bật',
    STATS.map((stat) => `- **${stat.value}** ${stat.label}`).join('\n'),
    '## Dịch vụ',
    SERVICES_LEAD,
    SERVICES.map((service) => `- [${service.title}](${canonicalUrl(service.href)}): ${service.text}`).join('\n'),
    '## Tuyến vận chuyển từ TP.HCM',
    ...routesByRegion().map((group) => `### ${group.label}\n\n${group.items.map((item) => `- ${pageLink(item)}`).join('\n')}`),
    '## Tại sao nên chọn dịch vụ của Vận tải Phương Vy?',
    COMMITMENTS.map((item) => `- **${item.title}:** ${item.text}`).join('\n'),
    '## Quy trình gửi hàng',
    PROCESS_STEPS.map((step, index) => `${index + 1}. **${step.title}:** ${step.text}`).join('\n'),
    `## Ưu đãi: ${OFFER.title}`,
    `Áp dụng cho: ${OFFER.services.join(', ')}.\n\n${OFFER.perks.map((perk) => `- ${perk}`).join('\n')}`,
    `## ${SITE_CONFIG.companyName}`,
    ...ABOUT,
    '## Báo chí nói về Vận tải Phương Vy',
    PRESS.map((item) => `- [${item.outlet}](${item.href})`).join('\n'),
    '## Khách hàng nói gì',
    TESTIMONIALS.map((item) => `> “${item.quote}”\n> — ${item.name}, ${item.role}`).join('\n\n'),
    ...(faq.length ? ['## Câu hỏi thường gặp', faq.map((entry) => `### ${entry.question}\n\n${entry.answer}`).join('\n\n')] : []),
    '## Cẩm nang vận tải',
    legacyPosts.slice(0, 3).map((post) => `- ${pageLink(post, displayTitle(post.title))}`).join('\n'),
    contactSection(),
  ].join('\n\n');
}

function blogMarkdown() {
  return [
    header({ title: BLOG_PAGE.heading, description: BLOG_PAGE.description, path: '/blog', updated: latestPostDate }),
    legacyPosts.map((post) => `- ${pageLink(post, displayTitle(post.title))} (${day(post.date)}): ${oneLine(HERO_LEADS[post.path] || post.seo.description || post.summary)}`).join('\n'),
    contactSection(),
  ].join('\n\n');
}

function entryMarkdown(item: LegacyEntry) {
  const isPost = item.kind === 'post';
  // /lien-he renders SITE_CONFIG (not its legacy body), so its twin does too.
  const body = item.path === '/lien-he'
    ? `${contactSection('## Thông tin liên hệ')}\n\n## Danh sách kho hàng\n\n${warehouseLines(WAREHOUSES)}`
    : absolutize(MARKDOWN_BODIES[item.path] || '').trim();
  // Same warehouses as the band under the route page's hero (src/components/site/warehouse-list.tsx).
  const warehouses = warehousesFor(item.path);
  return [
    header({
      title: displayTitle(item.title),
      description: item.seo.description || item.summary,
      path: item.path,
      author: item.author?.name,
      rating: item.rating,
      published: isPost ? item.date : undefined,
      updated: item.modified,
    }),
    HERO_LEADS[item.path],
    warehouses.length > 0 && `## Kho hàng Phương Vy tại ${warehouseArea(warehouses[0])}\n\n${warehouseLines(warehouses)}`,
    body,
    item.author?.bio && `## Về tác giả\n\n**${item.author.name}** — ${item.author.bio}`,
    item.path === '/lien-he' ? '' : `---\n\n${contactSection()}`,
  ].filter(Boolean).join('\n\n');
}

/** Markdown for a page path ("/", "/blog", "/van-chuyen-hang-hoa/da-nang"), or undefined. */
export function renderTwin(path: string): string | undefined {
  if (!TWIN_PATHS.includes(path)) return undefined;
  const markdown = path === '/' ? homeMarkdown() : path === '/blog' ? blogMarkdown() : entryMarkdown(getLegacyByPath(path)!);
  return `${markdown.replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

const twinLink = (item: LegacyEntry, label = item.label, note?: string) => `- [${label}](${markdownUrl(item.path)})${note ? `: ${oneLine(note)}` : ''}`;
const facts = (item: LegacyEntry) => [item.facts.transit && `thời gian khoảng ${item.facts.transit}`, item.facts.priceFrom && `giá từ ${item.facts.priceFrom}`].filter(Boolean).join(', ');
/** Curated, factual lead first; the Rank Math description (sometimes ad copy) only as a fallback. */
const note = (item: LegacyEntry) => HERO_LEADS[item.path] ?? item.seo.description;
const byPaths = (paths: string[]) => paths.map((path) => getLegacyByPath(path)).filter((item): item is LegacyEntry => Boolean(item));

/** llmstxt.org index: name, summary, context, then sections of markdown-twin links. */
export function renderLlmsTxt(): string {
  const hubs = byPaths(['/van-chuyen-hang-hoa', '/thue-xe-tai']);
  const company = byPaths(['/gioi-thieu', '/lien-he', '/faq', '/thu-ngo', '/tuyen-dung']);
  const policies = byPaths(['/chinh-sach-van-chuyen-va-giao-hang', '/phuong-thuc-thanh-toan', '/chinh-sach-bao-mat']);
  return `${[
    `# ${SITE_CONFIG.name}`,
    `> ${SITE_CONFIG.companyName}: chành xe, vận chuyển hàng hóa Bắc Nam từ TP.HCM đi các tỉnh thành và cho thuê xe tải 0,5–30 tấn. Hotline ${SITE_CONFIG.hotline}.`,
    `Mỗi trang trên ${getSiteUrl()} có bản Markdown cùng địa chỉ với đuôi \`.md\` (trang chủ: \`/index.md\`). Giá cước trong các trang là bảng giá tham khảo; báo giá chính xác qua hotline ${SITE_CONFIG.hotlines.join(', ')} hoặc Zalo ${SITE_CONFIG.zalo}, ${SITE_CONFIG.businessHours} tất cả các ngày. Trụ sở: ${SITE_CONFIG.address}.`,
    '## Dịch vụ chính',
    [`- [Trang chủ](${markdownUrl('/')}): tổng quan dịch vụ, tuyến, quy trình gửi hàng, ưu đãi`, ...hubs.map((item) => twinLink(item, item.label, note(item)))].join('\n'),
    ...routesByRegion().map((group) => `## Tuyến vận chuyển — ${group.label}\n\n${group.items.map((item) => twinLink(item, item.label, facts(item) || undefined)).join('\n')}`),
    '## Loại hàng & phương thức vận chuyển',
    cargoItems.map((item) => twinLink(item, item.label, note(item))).join('\n'),
    '## Cho thuê xe tải theo khu vực',
    truckItems.map((item) => twinLink(item, item.label, note(item))).join('\n'),
    '## Cẩm nang vận tải',
    [`- [${BLOG_PAGE.heading}](${markdownUrl('/blog')}): danh sách bài viết`, ...legacyPosts.map((post) => twinLink(post, displayTitle(post.title), HERO_LEADS[post.path]))].join('\n'),
    '## Công ty',
    company.map((item) => twinLink(item, displayTitle(item.title))).join('\n'),
    '## Optional',
    [...policies.map((item) => twinLink(item, displayTitle(item.title))), `- [Toàn bộ nội dung trong một tệp](${getSiteUrl()}/llms-full.txt)`].join('\n'),
  ].join('\n\n')}\n`;
}

/** A route page in llms-full.txt: what it serves and its key facts, with the full twin one link away. */
function routeDigest(item: LegacyEntry) {
  const warehouses = warehousesFor(item.path);
  return [
    `# ${displayTitle(item.title)}`,
    `- URL: ${canonicalUrl(item.path)}`,
    `- Toàn văn: ${markdownUrl(item.path)}`,
    facts(item) && `- Dữ kiện: ${facts(item)}`,
    warehouses.length > 0 && `- Kho: ${warehouses.map((warehouse) => `${warehouse.label}: ${warehouse.address}`).join('; ')}`,
    oneLine(HERO_LEADS[item.path] || item.seo.description || item.summary),
  ].filter(Boolean).join('\n');
}

/**
 * Every page in reading order (home, hubs, routes, cargo, trucks, posts, company, policies), sized for
 * an assistant's context window: full text for hubs, services, guides and company pages; a digest for
 * each of the 65 route pages (their full twin is linked); the contact block once, at the end.
 */
export function renderLlmsFull(): string {
  const routeOrder = routesByRegion().flatMap((group) => group.items.map((item) => item.path));
  const routes = new Set(routeOrder);
  const order = [
    '/', '/van-chuyen-hang-hoa', ...routeOrder, ...cargoItems.map((item) => item.path),
    '/thue-xe-tai', ...truckItems.map((item) => item.path), '/blog', ...legacyPosts.map((post) => post.path),
  ];
  const rest = TWIN_PATHS.filter((path) => !order.includes(path));
  const contact = `---\n\n${contactSection()}`;
  const sections = [...new Set([...order, ...rest])].map((path) => {
    if (routes.has(path)) return routeDigest(getLegacyByPath(path)!);
    return renderTwin(path)?.replace(contact, '').trim();
  });
  return `${[...sections.filter(Boolean), contactSection()].join('\n\n---\n\n')}\n`;
}
