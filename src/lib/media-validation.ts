export const MEDIA_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/ogg';
export const MEDIA_MIME = /^(image\/(jpeg|png|webp|gif|avif)|video\/(mp4|webm|ogg))$/;
export function validateMediaFile(file: { type: string; size: number }): string | null {
  if (!MEDIA_MIME.test(file.type)) return 'Hỗ trợ JPG, PNG, WebP, GIF, AVIF hoặc video MP4, WebM, OGG.';
  if (file.size <= 0 || file.size > 50 * 1024 * 1024) return 'File phải có nội dung và không vượt quá 50MB.';
  return null;
}
