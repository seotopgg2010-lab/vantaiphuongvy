/**
 * Article bodies rewritten at the owner's request, which scripts/build-legacy.ts uses
 * in place of the WordPress export's content (pages.json and posts.json stay as
 * exported). The new body goes through the same cleaning, outline, FAQ, image and
 * link steps as any WordPress article; the author box and star rating still come
 * from the original. `modified` is the rewrite date in site-local time.
 */
export type ArticleUpdate = { file: string; modified: string };

export const ARTICLE_UPDATES: Record<string, ArticleUpdate> = {
  // Signs, fines and city truck hours as in force on 2026-10-06 (QCVN 41:2024, Nghị định 168/2024 as amended, city decisions).
  '/blog/bien-bao-cam-xe-tai-va-muc-phat': { file: 'src/content/articles/bien-bao-cam-xe-tai-va-muc-phat.html', modified: '2026-10-10T16:00:00' },
  // The WordPress bodies of these three route pages were pasted from other provinces (May 2026): the
  // Điện Biên – Lai Châu page held the Sơn La article, Sơn La held Thái Nguyên, Vinh – Nghệ An held Bình Định.
  // Sơn La gets its own article back; the other two are written for their province from site facts.
  '/van-chuyen-hang-hoa/son-la': { file: 'src/content/articles/son-la.html', modified: '2026-10-10T15:00:00' },
  '/van-chuyen-hang-hoa/dien-bien-lai-chau': { file: 'src/content/articles/dien-bien-lai-chau.html', modified: '2026-10-10T15:00:00' },
  '/van-chuyen-hang-hoa/vinh-nghe-an': { file: 'src/content/articles/vinh-nghe-an.html', modified: '2026-10-10T15:00:00' },
};
