import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  security.configs.recommended,
  // Override default ignores of eslint-config-next.
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "jsx-a11y/alt-text": "off",
      "react/no-children-prop": "off",
      "react/display-name": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "security/detect-possible-timing-attacks": "off",
      "import/no-anonymous-default-export": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/rules-of-hooks": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "security/detect-object-injection": "off",
      "security/detect-unsafe-regex": "off",
      "security/detect-non-literal-regexp": "off",
      "security/detect-non-literal-fs-filename": "off",
      "@next/next/no-img-element": "off"
    }
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
