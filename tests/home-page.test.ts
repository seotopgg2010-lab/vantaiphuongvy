import assert from 'node:assert/strict';
import test from 'node:test';
import { homeFaq } from '../src/lib/legacy-content';
import { noBreakBrand } from '../src/lib/legacy-render';
import { renderTwin } from '../src/lib/markdown-twins';

test('the home FAQ answers customer questions, not encyclopedic definitions, and its twin shows the same', () => {
  const faq = homeFaq();
  assert.ok(faq.length >= 4);
  for (const entry of faq) {
    assert.doesNotMatch(entry.question, /là gì\?$/, entry.question);
    // No ALL-CAPS slogan lines glued onto an answer.
    assert.doesNotMatch(entry.answer, /\p{Lu}{4,}(?:\s+\p{Lu}+){3,}/u, entry.question);
  }
  const twin = renderTwin('/')!;
  const section = twin.slice(twin.indexOf('## Câu hỏi thường gặp'));
  for (const entry of faq) assert.ok(section.includes(`### ${entry.question}`), entry.question);
});

test('section headings keep the brand on one line without changing the words', () => {
  const title = 'Dịch vụ Vận tải Phương Vy đang cung cấp';
  const kept = noBreakBrand(title);
  assert.ok(kept.includes('Vận tải Phương Vy'));
  assert.equal(kept.replace(/ /g, ' '), title);
  assert.equal(noBreakBrand('Công ty TNHH Dịch vụ Vận tải Phương Vy'), 'Công ty TNHH Dịch vụ Vận tải Phương Vy');
  assert.equal(noBreakBrand('Khách hàng nói gì về Phương Vy'), 'Khách hàng nói gì về Phương Vy');
});
