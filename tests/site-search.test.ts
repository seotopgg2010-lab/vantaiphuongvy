import assert from 'node:assert/strict';
import test from 'node:test';
import { routableItems } from '../src/lib/legacy-content';
import { searchPages } from '../src/lib/search';

const search = (query: string) => searchPages(routableItems, query).map((item) => item.path);

test('the page a query names comes first, typed with or without diacritics or spaces', () => {
  for (const query of ['Hà Nội', 'ha noi', 'hanoi']) assert.equal(search(query)[0], '/van-chuyen-hang-hoa/ha-noi', query);
  assert.equal(search('gửi hàng đi Đà Nẵng')[0], '/van-chuyen-hang-hoa/da-nang');
  assert.equal(search('thuê xe tải hà nội')[0], '/thue-xe-tai/ha-noi');
  assert.equal(search('phạt xe tải')[0], '/blog/bien-bao-cam-xe-tai-va-muc-phat');
});

test('other spellings of a place find its page', () => {
  for (const query of ['Kon Tum', 'kontum']) assert.equal(search(query)[0], '/van-chuyen-hang-hoa/kontum', query);
  for (const query of ['Buôn Ma Thuột', 'buon me thuot', 'BMT']) assert.equal(search(query)[0], '/van-chuyen-hang-hoa/chanh-xe-chuyen-hang-di-buon-me-thuot', query);
  for (const query of ['Sài Gòn', 'HCM', 'TP.HCM']) assert.ok(search(query).slice(0, 2).includes('/van-chuyen-hang-hoa/tphcm'), query);
});

test('query words match whole words, not pieces of longer words', () => {
  // "huye" is inside "chuyển", "chuyến" and "huyện" on almost every page but is not a word anywhere.
  assert.deepEqual(search('huye'), []);
  assert.deepEqual(search('   '), []);
});
