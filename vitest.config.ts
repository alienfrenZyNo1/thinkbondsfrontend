import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        'src/e2e/',
        'src/mocks/',
        'coverage/',
        '.next/',
        'dist/',
        'build/',
        'public/',
        'vitest.config.ts',
        'playwright.config.ts',
        'next.config.ts',
        'eslint.config.mjs',
        '.eslintrc.json',
        '.prettierrc',
        '.lintstagedrc',
        'postcss.config.mjs',
        'tailwind.config.ts',
        'tsconfig.json',
        'package.json',
        'README.md',
        'CHANGELOG.md',
        'Dockerfile',
        'docker/',
        '.husky/',
        '.roo/',
        'keycloakexample.html',
        'Portal Design Document.docx'
      ]
    }
  },
});