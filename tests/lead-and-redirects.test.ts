import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { LEAD_LIMITS, looksLikeBot, normalizeVietnamesePhone, validateLead } from '../src/lib/lead-validation';
import { resolveLegacyRequest } from '../src/lib/legacy-redirects';

test('Vietnamese phone numbers are normalised', () => {
  assert.equal(normalizeVietnamesePhone('0933 871 139'), '0933871139');
  assert.equal(normalizeVietnamesePhone('+84 933.871.139'), '0933871139');
  assert.equal(normalizeVietnamesePhone('84702006839'), '0702006839');
  assert.equal(normalizeVietnamesePhone('(028) 6275 0737'), '02862750737');
  assert.equal(normalizeVietnamesePhone('12345'), null);
  assert.equal(normalizeVietnamesePhone('0133871139'), null);
});

test('lead validation requires name + phone and trims/limits input', () => {
  const bad = validateLead({ name: 'A', phone: 'abc' });
  assert.equal(bad.ok, false);
  if (!bad.ok) { assert.ok(bad.errors.name); assert.ok(bad.errors.phone); }

  const good = validateLead({ name: '  Nguyễn   Văn A ', phone: '0933 871 139', note: 'x'.repeat(5000), service: 'Thuê xe tải nguyên chuyến', page: 'https://evil.example' });
  assert.equal(good.ok, true);
  if (good.ok) {
    assert.equal(good.data.name, 'Nguyễn Văn A');
    assert.equal(good.data.phone, '0933871139');
    assert.equal(good.data.note.length, 1000);
    assert.equal(good.data.page, '');
  }
  assert.equal(validateLead({ name: 'Nam', phone: '0933871139', service: 'hack' }).ok, false);
});

test('stored leads use the contact_leads columns, within their length limits', () => {
  // lead-delivery.ts is server-only, so the insert is checked against the migration as text.
  const delivery = readFileSync(join(process.cwd(), 'src/lib/lead-delivery.ts'), 'utf8');
  const migration = readFileSync(join(process.cwd(), 'supabase/migrations/001_contact_leads.sql'), 'utf8');
  const inserted = [...(delivery.match(/\.insert\(\{([\s\S]*?)\}\)/)?.[1] ?? '').matchAll(/(\w+):/g)].map((match) => match[1]);
  assert.ok(inserted.length >= 8, 'insert payload not found');
  const lengthOf = (column: string) => Number(migration.match(new RegExp(`char_length\\(${column}\\)\\s*(?:<=|between \\d+ and)\\s*(\\d+)`))?.[1]);
  const field: Record<string, keyof typeof LEAD_LIMITS> = { name: 'name', phone: 'phone', service: 'service', route_from: 'from', route_to: 'to', cargo: 'cargo', note: 'note', source_path: 'page' };
  for (const column of inserted) {
    assert.match(migration, new RegExp(`^\\s+${column}\\s`, 'm'), `${column} is not a contact_leads column`);
    assert.equal(lengthOf(column), LEAD_LIMITS[field[column]], `${column} length limit differs from the form`);
  }
});

test('bot heuristics: honeypot and timing', () => {
  const now = 1_000_000_000;
  assert.equal(looksLikeBot('', now - 10_000, now), false);
  assert.equal(looksLikeBot('http://spam', now - 10_000, now), true);
  assert.equal(looksLikeBot('', now - 500, now), true);
  assert.equal(looksLikeBot('', 0, now), true);
});

test('WordPress leftovers return 410 and short links 301', () => {
  const none = new URLSearchParams();
  for (const path of ['/wp-login.php', '/xmlrpc.php', '/wp-admin/', '/wp-json/wp/v2/posts', '/sitemap980.xml', '/locations.kml']) {
    assert.deepEqual(resolveLegacyRequest(path, none), { kind: 'gone' }, path);
  }
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('p=1337')), { kind: 'redirect', location: '/van-chuyen-hang-hoa/ha-noi/' });
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('p=999999')), { kind: 'redirect', location: '/' });
  // Attachments go to the page they belong to, as Rank Math redirected them (also when linked as ?p=).
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('attachment_id=3000')), { kind: 'redirect', location: '/blog/can-tim-doi-tac-van-chuyen-hang-hoa/' });
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('p=3000')), { kind: 'redirect', location: '/blog/can-tim-doi-tac-van-chuyen-hang-hoa/' });
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('attachment_id=999999')), { kind: 'redirect', location: '/' });
  assert.deepEqual(resolveLegacyRequest('/', new URLSearchParams('s=đà nẵng')), { kind: 'redirect', location: `/tim-kiem/?q=${encodeURIComponent('đà nẵng')}` });
  for (const path of ['/', '/van-chuyen-hang-hoa/', '/wp-content/uploads/2018/08/x.jpg', '/sitemap.xml']) {
    assert.equal(resolveLegacyRequest(path, none), null, path);
  }
});
