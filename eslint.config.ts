import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import eslint from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': eslint,
    },

    languageOptions: {
      parser,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
