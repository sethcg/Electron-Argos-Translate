import globals from "globals";
import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: ['node_modules/', 'dist/', '.vite/', 'out/',],
  },
  {
    settings: {react: { version: "detect" }},
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
  },
  {
    languageOptions: {
      parserOptions: {ecmaFeatures: { jsx: true }},
      globals: {...globals.browser, ...globals.node},
    },
  },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off",
    },
  },
];