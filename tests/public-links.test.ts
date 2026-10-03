import assert from 'node:assert/strict';
import test from 'node:test';
import { BRIEF_NAVIGATION } from '../src/content/brief-navigation';
import { getLegacyRouteCount, isPublicRoute } from '../src/lib/public-links';

const navigationPaths = BRIEF_NAVIGATION.flatMap((group) => [group.href, ...group.items.flatMap((section) => section.items.map((item) => item.href))]);

test('public navigation links all resolve to the immutable Phuong Vy corpus', () => {
  assert.ok(getLegacyRouteCount() >= 90);
  for (const path of navigationPaths) {
    assert.equal(isPublicRoute(path), true, `unresolved public navigation path: ${path}`);
    assert.equal(path.includes('hamburg'), false);
    assert.equal(path.startsWith('/home-3'), false);
    assert.equal(path.startsWith('/van-chuyen-quoc-te'), false);
    assert.equal(path.startsWith('/san-xuat-cung-ung'), false);
    assert.equal(path.startsWith('/giai-phap-tron-goi'), false);
  }
});

test('unsupported legacy references remain excluded from the public contract', () => {
  for (const path of ['/home-3', '/van-chuyen-quoc-te', '/san-xuat-cung-ung', '/giai-phap-tron-goi', '/du-an']) {
    assert.equal(isPublicRoute(path), false);
  }
});
