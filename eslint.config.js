/* eslint-env node */
// Flat ESLint config (CommonJS) compatible with ESLint v9+
// Mirrors prior .eslintrc.json and adds ignores

const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  // Ignore generated and report artifacts
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  // Next.js specific config is omitted here due to package export shape.
  // Core linting and TypeScript rules are applied below.
  // TypeScript support
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Test utilities overrides (still warn on any but allow flexibility)
  {
    files: ['src/tests/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Apply Prettier config to disable stylistic rules in ESLint
  prettierConfig,
];
