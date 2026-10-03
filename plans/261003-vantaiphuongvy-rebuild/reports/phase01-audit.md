# Phase 01 audit report

## Scope

Audit public runtime imports and leftover Hamburg traces before UI/SEO cleanup.

## Public route inventory

Generated from `src/app` excluding internal admin routes:

- `src/app/[lang]/page.tsx`
- `src/app/[lang]/blog/page.tsx`
- `src/app/[lang]/tim-kiem/page.tsx`
- `src/app/[lang]/[...legacy]/page.tsx`

Route handlers `robots.ts` and `sitemap.ts` are public metadata endpoints. Admin routes remain internal and are handled in Phase 05.

## Findings

| Area | Finding | Action |
|---|---|---|
| Public pages | No public page imports `src/components/sections`, `products`, `shipping`, `brief`, `src/lib/data.ts` or `src/lib/queries.ts`. | Keep isolated until Phase 05 cleanup. |
| Legacy data | `src/legacy-content/pages.json`, `posts.json`, and `src/lib/legacy-content.ts` are required by public legacy/blog routes. | Preserve unchanged. |
| Navigation | `src/content/brief-navigation.ts` is required by `Header.tsx` and `MobileMenu.tsx`. | Preserve and keep Vietnamese-only behavior. |
| Analytics | Cookie key was still `hamburg-analytics-consent`. | Changed to `phuongvy-analytics-consent`. |
| Hamburg content | Hamburg traces remain in dead legacy modules and admin/query modules. | Do not expose publicly; cleanup in Phase 05 after dependency recheck. |

## Commands run

```text
grep -RInEi "hamburg|Hamburg|HAMBURG" src --include='*.ts' --include='*.tsx' --include='*.json'
find public route inventory via Node filesystem walk
npm run typecheck
npm run lint
```

## Verification

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- Public route inventory written to `reports/public-routes.txt`.
- `git -C D:/CodeVipPro/hamburg status --short` shows only pre-existing changes/untracked files; no Hamburg project files were edited by this batch.

## Remaining work

- Remove or rebrand dead Hamburg modules in Phase 05.
- Decide whether to retain or remove `/admin`.
- Add automated URL/SEO regression tests in Phase 06.
