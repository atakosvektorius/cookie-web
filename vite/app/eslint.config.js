// -----------------------------------------------------------
//  [*] ESLint configuration (flat config)
//
//  Standard Vite + React setup: the JS recommended rules plus
//  the react-hooks rules (rules-of-hooks as an error —
//  conditional hooks are real bugs; exhaustive-deps as a
//  warning) and react-refresh's check that a component file
//  exports only components, so fast refresh keeps working.
//
//  Run inside the slapukai-vite dev container:
//    npm run lint
// -----------------------------------------------------------

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
