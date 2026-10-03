import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveLocaleRoute } from '../src/lib/locale-routing';

test('default Vietnamese URLs rewrite internally', () => {
  assert.deepEqual(resolveLocaleRoute('/'), { kind: 'rewrite', pathname: '/vi/' });
  assert.deepEqual(resolveLocaleRoute('/van-chuyen-hang-hoa/'), { kind: 'rewrite', pathname: '/vi/van-chuyen-hang-hoa/' });
});

test('explicit Vietnamese prefix redirects to the public unprefixed URL', () => {
  assert.deepEqual(resolveLocaleRoute('/vi'), { kind: 'redirect', pathname: '/' });
  assert.deepEqual(resolveLocaleRoute('/vi/faq/'), { kind: 'redirect', pathname: '/faq/' });
  assert.deepEqual(resolveLocaleRoute('/vi/faq/', true), { kind: 'rewrite', pathname: '/vi/faq/' });
});

test('English URLs are hard 404s', () => {
  assert.deepEqual(resolveLocaleRoute('/en'), { kind: 'not-found' });
  assert.deepEqual(resolveLocaleRoute('/en/about/'), { kind: 'not-found' });
});
