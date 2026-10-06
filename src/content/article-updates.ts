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
  '/blog/bien-bao-cam-xe-tai-va-muc-phat': { file: 'src/content/articles/bien-bao-cam-xe-tai-va-muc-phat.html', modified: '2026-10-06T10:00:00' },
};
