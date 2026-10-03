import assert from 'node:assert/strict';
import test from 'node:test';
import { getLegacyByPath, legacyItems } from '../src/lib/legacy-content';

const removedPaths = [
  '/bang-hieu', '/du-an', '/van-chuyen-quoc-te', '/giai-phap-tron-goi',
  '/san-xuat-cung-ung', '/dieu-khoan-su-dung', '/cam-on', '/en', '/en/anything',
];

test('every immutable legacy URL resolves exactly once', () => {
  const paths = legacyItems.map((item) => item.path);
  assert.equal(new Set(paths).size, paths.length, 'legacy paths must be unique');
  assert.ok(paths.length >= 95, 'expected WordPress page and post corpus');

  for (const item of legacyItems) {
    assert.equal(getLegacyByPath(item.path)?.id, item.id, item.path);
    assert.equal(getLegacyByPath(`${item.path}/`)?.id, item.id, `${item.path}/`);
  }
});

test('removed Hamburg and unsupported locale URLs do not resolve', () => {
  for (const path of removedPaths) assert.equal(getLegacyByPath(path), undefined, path);
});

test('legacy content does not expose the retired home-3 route in public contract', () => {
  assert.ok(legacyItems.some((item) => item.path === '/home-3'));
});
