/**
 * Readers' phone numbers and e-mail addresses in the WordPress comments are masked before the
 * snapshot is written: the repository is public (owner decision, 2026-10-06).
 * PHONE matches Vietnamese numbers (0…, +84…, 84…) of 8–11 digits, with or without spaces, dots
 * or dashes ("0912.345.678", "+84 912 345 678").
 */
export const PHONE_PATTERN = /(?:\+84[\s.-]?|0)\d(?:[\s.-]?\d){6,9}|\b84\d{9}\b/g;
export const EMAIL_PATTERN = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

export function maskContacts(text: string): string {
  return text.replace(EMAIL_PATTERN, '[đã ẩn email]').replace(PHONE_PATTERN, '[đã ẩn số điện thoại]');
}
