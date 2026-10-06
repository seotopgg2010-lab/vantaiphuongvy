/**
 * Article bodies rewritten at the owner's request, which scripts/build-legacy.ts uses
 * in place of the WordPress export's content (pages.json and posts.json stay as
 * exported). The new body goes through the same cleaning, outline, FAQ, image and
 * link steps as any WordPress article; the author box and star rating still come
 * from the original. `modified` is the rewrite date in site-local time.
 */
export type ArticleUpdate = { file: string; modified: string };

export const ARTICLE_UPDATES: Record<string, ArticleUpdate> = {};
