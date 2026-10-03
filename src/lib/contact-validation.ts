import { CONTACT_NEED_VALUES, normalizeContactNeed } from './contact-needs';

const MAX_FIELD_LENGTH = {
  name: 200,
  phone: 30,
  email: 254,
  destinationCountry: 120,
  destinationCity: 120,
  businessType: 120,
  needs: 500,
  currentStatus: 80,
  investmentLevel: 80,
  areaSqm: 40,
  deliveryTime: 80,
  preferredContact: 40,
  message: 5000,
  sourcePage: 500,
  referenceCode: 120,
  locale: 10,
  utm: 120,
} as const;

export const MAX_CONTACT_ATTACHMENT_SIZE = 20 * 1024 * 1024;

const ALLOWED_NEEDS = new Set(CONTACT_NEED_VALUES);

const ALLOWED_LOCALES = new Set(['vi', 'en']);
const ALLOWED_PREFERRED_CONTACT = new Set(['zalo', 'whatsapp', 'email', 'messenger']);
const SAFE_REFERENCE_PATTERN = /^[A-Za-z0-9._-]+$/;

export type ContactFieldInput = {
  name: string;
  phone: string;
  email: string;
  needs: string[];
  destinationCountry: string;
  destinationCity?: string;
  businessType?: string;
  currentStatus?: string;
  investmentLevel?: string;
  area?: string;
  deliveryTime?: string;
  preferredContact?: string;
  message?: string;
  privacyConsent: boolean;
  sourcePage?: string;
  referenceCode?: string;
  locale?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type NormalizedContactFields = {
  name: string;
  phone: string;
  email: string;
  needs: string[];
  destinationCountry: string;
  destinationCity: string;
  countryState: string;
  businessType: string | null;
  currentStatus: string | null;
  investmentLevel: string | null;
  areaSqm: string | null;
  deliveryTime: string | null;
  preferredContact: string | null;
  message: string | null;
  privacyConsent: true;
  sourcePage: string | null;
  referenceCode: string | null;
  locale: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export type ContactFieldValidation =
  | { valid: true; value: NormalizedContactFields }
  | { valid: false; field: string; error: string };

export type ContactAttachmentExtension = 'jpg' | 'png' | 'webp' | 'pdf' | 'dwg' | 'dxf';

export type AttachmentValidation =
  | { valid: true; extension: ContactAttachmentExtension; contentType: string }
  | { valid: false; field: 'attachment'; error: string };

function trim(value: string | undefined): string {
  return (value || '').trim();
}

function exceeds(value: string, limit: number): boolean {
  return value.length > limit;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}

function normalizeNeed(value: string): string {
  return normalizeContactNeed(value);
}

function isShippingOnly(needs: string[]): boolean {
  return needs.length === 1 && needs[0] === 'shipping';
}

function isSafeSourcePage(sourcePage: string): boolean {
  return sourcePage === '' || (sourcePage.startsWith('/') && !sourcePage.startsWith('//') && !/[\u0000-\u001f]/.test(sourcePage));
}

function validateLength(value: string, field: string, limit: number): ContactFieldValidation | null {
  if (exceeds(value, limit)) {
    return { valid: false, field, error: `${field} vượt quá độ dài cho phép (${limit} ký tự).` };
  }
  return null;
}

export function validateContactFields(input: ContactFieldInput): ContactFieldValidation {
  const name = trim(input.name);
  const phone = trim(input.phone);
  const email = trim(input.email);
  const destinationCountry = trim(input.destinationCountry);
  const destinationCity = trim(input.destinationCity);
  const businessType = trim(input.businessType);
  const rawNeeds = input.needs.map(normalizeNeed).filter(Boolean);
  const needs = [...new Set(rawNeeds)];
  const currentStatus = trim(input.currentStatus);
  const investmentLevel = trim(input.investmentLevel);
  const area = trim(input.area);
  const deliveryTime = trim(input.deliveryTime);
  const preferredContact = trim(input.preferredContact).toLowerCase();
  const message = trim(input.message);
  const sourcePage = trim(input.sourcePage);
  const referenceCode = trim(input.referenceCode);
  const locale = trim(input.locale).toLowerCase() || 'vi';
  const utmSource = trim(input.utmSource);
  const utmMedium = trim(input.utmMedium);
  const utmCampaign = trim(input.utmCampaign);

  if (!name) return { valid: false, field: 'name', error: 'Vui lòng nhập họ tên.' };
  if (!phone || !isValidPhone(phone)) return { valid: false, field: 'phone', error: 'Số điện thoại không hợp lệ.' };
  if (!email || !isValidEmail(email)) return { valid: false, field: 'email', error: 'Email không hợp lệ.' };
  if (needs.length === 0 || needs.some((need) => !ALLOWED_NEEDS.has(need as typeof CONTACT_NEED_VALUES[number]))) return { valid: false, field: 'needs', error: 'Vui lòng chọn nhu cầu phù hợp.' };
  if (!destinationCountry) return { valid: false, field: 'destination_country', error: 'Vui lòng chọn nơi nhận hàng.' };
  if (!input.privacyConsent) return { valid: false, field: 'privacy_consent', error: 'Anh chị cần đồng ý với Chính sách bảo mật trước khi gửi yêu cầu.' };
  if (!ALLOWED_LOCALES.has(locale)) return { valid: false, field: 'locale', error: 'Ngôn ngữ biểu mẫu không hợp lệ.' };
  if (preferredContact && !ALLOWED_PREFERRED_CONTACT.has(preferredContact)) return { valid: false, field: 'preferred_contact', error: 'Kênh liên hệ không hợp lệ.' };
  if (referenceCode && !SAFE_REFERENCE_PATTERN.test(referenceCode)) return { valid: false, field: 'reference_code', error: 'Mã yêu cầu không hợp lệ.' };
  if (!isSafeSourcePage(sourcePage)) return { valid: false, field: 'source_page', error: 'Trang nguồn không hợp lệ.' };

  const lengths: Array<[string, string, number]> = [
    ['name', name, MAX_FIELD_LENGTH.name],
    ['phone', phone, MAX_FIELD_LENGTH.phone],
    ['email', email, MAX_FIELD_LENGTH.email],
    ['destination_country', destinationCountry, MAX_FIELD_LENGTH.destinationCountry],
    ['destination_city', destinationCity, MAX_FIELD_LENGTH.destinationCity],
    ['business_type', businessType, MAX_FIELD_LENGTH.businessType],
    ['needs', needs.join(','), MAX_FIELD_LENGTH.needs],
    ['current_status', currentStatus, MAX_FIELD_LENGTH.currentStatus],
    ['investment_level', investmentLevel, MAX_FIELD_LENGTH.investmentLevel],
    ['area', area, MAX_FIELD_LENGTH.areaSqm],
    ['delivery_time', deliveryTime, MAX_FIELD_LENGTH.deliveryTime],
    ['preferred_contact', preferredContact, MAX_FIELD_LENGTH.preferredContact],
    ['message', message, MAX_FIELD_LENGTH.message],
    ['source_page', sourcePage, MAX_FIELD_LENGTH.sourcePage],
    ['reference_code', referenceCode, MAX_FIELD_LENGTH.referenceCode],
    ['locale', locale, MAX_FIELD_LENGTH.locale],
    ['utm_source', utmSource, MAX_FIELD_LENGTH.utm],
    ['utm_medium', utmMedium, MAX_FIELD_LENGTH.utm],
    ['utm_campaign', utmCampaign, MAX_FIELD_LENGTH.utm],
  ];
  for (const [field, value, limit] of lengths) {
    const error = validateLength(value, field, limit);
    if (error) return error;
  }

  const shippingOnly = isShippingOnly(needs);
  return {
    valid: true,
    value: {
      name,
      phone,
      email,
      needs,
      destinationCountry,
      destinationCity,
      countryState: [destinationCountry, destinationCity].filter(Boolean).join(', '),
      businessType: businessType || null,
      currentStatus: shippingOnly ? null : currentStatus || null,
      investmentLevel: shippingOnly ? null : investmentLevel || null,
      areaSqm: shippingOnly ? null : area || null,
      deliveryTime: deliveryTime || null,
      preferredContact: preferredContact || null,
      message: message || null,
      privacyConsent: true,
      sourcePage: sourcePage || null,
      referenceCode: referenceCode || null,
      locale,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
    },
  };
}

function startsWithBytes(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

function matchesExtension(fileName: string, detectedExtension: ContactAttachmentExtension): boolean {
  const normalizedFileName = fileName.trim().toLowerCase();
  const actualExtension = normalizedFileName.split('.').pop();
  const equivalentExtensions: Record<string, string[]> = {
    jpg: ['jpg', 'jpeg'],
    png: ['png'],
    webp: ['webp'],
    pdf: ['pdf'],
    dwg: ['dwg'],
    dxf: ['dxf'],
  };

  return Boolean(actualExtension && equivalentExtensions[detectedExtension]?.includes(actualExtension));
}

function acceptedAttachment(fileName: string, extension: ContactAttachmentExtension, contentType: string): AttachmentValidation {
  if (!matchesExtension(fileName, extension)) {
    return { valid: false, field: 'attachment', error: 'File không đúng định dạng hoặc nội dung không khớp phần mở rộng.' };
  }

  return { valid: true, extension, contentType };
}

export async function validateContactAttachment(file: File | null): Promise<AttachmentValidation> {
  if (!file || file.size === 0) return { valid: true, extension: 'pdf', contentType: 'application/octet-stream' };
  if (file.size > MAX_CONTACT_ATTACHMENT_SIZE) return { valid: false, field: 'attachment', error: 'File tải lên không được vượt quá 20MB.' };

  const bytes = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return acceptedAttachment(file.name, 'jpg', 'image/jpeg');
  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return acceptedAttachment(file.name, 'png', 'image/png');
  if (startsWithBytes(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return acceptedAttachment(file.name, 'pdf', 'application/pdf');
  if (startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP') return acceptedAttachment(file.name, 'webp', 'image/webp');

  const text = new TextDecoder().decode(bytes).trimStart();
  if (/^AC10\d{2}/.test(text)) return acceptedAttachment(file.name, 'dwg', 'application/acad');
  if (/^(0\s*\n\s*SECTION|999\s*\n)/.test(text)) return acceptedAttachment(file.name, 'dxf', 'application/dxf');

  return { valid: false, field: 'attachment', error: 'File không đúng định dạng hoặc nội dung không khớp phần mở rộng.' };
}
