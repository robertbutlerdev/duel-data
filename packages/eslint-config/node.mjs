import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslint from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import security from 'eslint-plugin-security';
import turboConfig from 'eslint-config-turbo/flat';

export const eslintNode = [
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  prettierConfig,
  security.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  ...turboConfig,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/array-type': 'off',
      'no-console': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-warning-comments': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      'turbo/no-undeclared-env-vars': 'warn',
    },
    plugins: { 'simple-import-sort': simpleImportSort },
    settings: {
      'import/resolver': { typescript: true },
    },
  },
  { ignores: ['**/src/**/*generated*', '**/dist/**', '**/node_modules/**'] },
];
