// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Игнорируем сам конфиг
  {
    ignores: ['dist', 'node_modules', 'eslint.config.mjs'],
  },

  // Базовые правила ESLint
  eslint.configs.recommended,

  // Правила для TypeScript
  ...tseslint.configs.recommended,

  // Конфигурация Prettier. ВАЖНО: prettierConfig должен быть последним в списке "правил",
  // чтобы он мог отключить конфликтующие правила ESLint.
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error', // Включаем правило, которое подсвечивает ошибки Prettier
    },
  },

  // Глобальные переменные и настройки парсера для твоего проекта
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  
  // Твои персональные правила
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
);