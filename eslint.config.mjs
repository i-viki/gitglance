import js from "@eslint/js";
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        requestAnimationFrame: "readonly",
        setTimeout: "readonly",
        console: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Promise: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
