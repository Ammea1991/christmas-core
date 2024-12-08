import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: { globals: globals.browser },
    rules: {
      indent: ['error', 'tab'], // Imposta i tab come indentazione
    },
  },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
