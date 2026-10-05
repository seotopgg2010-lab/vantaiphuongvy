import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Alternate build dirs (NEXT_DIST_DIR), git-ignored as /.next-*/.
    ".next-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // One-off CommonJS maintenance scripts executed directly by Node.
    "fix3.js",
    "generate-admin.js",
    "plans/reports/ui-evidence-261002-1644/**",
  ]),
]);

export default eslintConfig;
