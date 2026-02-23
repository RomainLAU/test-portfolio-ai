import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { parser as eslintParserTypeScript } from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
      "unused-imports": eslintPluginUnusedImports,
    },
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": [
        "warn",
        {
          printWidth: 80,
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "none",
        },
      ],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app/global.css",
        callees: ["cn", "clsx", "twMerge"],
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  eslintConfigPrettier, // ✅ Ajoutez ça à la fin
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
