import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
  ]),
  // ✅ Override-uri pentru proiect
  {
    rules: {
      // Dezactivăm "any" - folosim în teste și cod legacy
      "@typescript-eslint/no-explicit-any": "off",
      // Dezactivăm warning img - folosim <img> clasic intenționat
      "@next/next/no-img-element": "off",
      // Dezactivăm Link warning - folosim <a> intenționat
      "@next/next/no-html-link-for-pages": "off",
      // Dezactivăm unused vars ca warning nu eroare
      "@typescript-eslint/no-unused-vars": "warn",
      // Dezactivăm apostrofe escaped
      "react/no-unescaped-entities": "off",
      // Dezactivăm setState in effect - pattern valid în Next.js
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // ✅ Ignorăm fișierele de test din lint strict
  {
    files: ["__tests__/**"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);



export default eslintConfig;