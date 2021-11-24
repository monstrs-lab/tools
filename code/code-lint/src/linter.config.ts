const { config: prettierConfig } = require('@monstrs/code-format')

const { rules: baseBestPracticesRules } = require('eslint-config-airbnb-base/rules/best-practices')
const { rules: baseErrorsRules } = require('eslint-config-airbnb-base/rules/errors')
const { rules: baseES6Rules } = require('eslint-config-airbnb-base/rules/es6')
const { rules: baseImportsRules } = require('eslint-config-airbnb-base/rules/imports')
const { rules: baseStyleRules } = require('eslint-config-airbnb-base/rules/style')
const { rules: baseVariablesRules } = require('eslint-config-airbnb-base/rules/variables')

export const config = () => {
  const { eslintConfigErrors } = require('@monstrs/code-runtime')
  const { eslintConfigEs6 } = require('@monstrs/code-runtime')
  const { eslintConfigImports } = require('@monstrs/code-runtime')
  const { eslintConfigNode } = require('@monstrs/code-runtime')
  const { eslintConfigStrict } = require('@monstrs/code-runtime')
  const { eslintConfigStyle } = require('@monstrs/code-runtime')
  const { eslintConfigVariables } = require('@monstrs/code-runtime')
  const { eslintConfigHooks } = require('@monstrs/code-runtime')
  const { eslintConfigReact } = require('@monstrs/code-runtime')
  const { eslintConfigReactA11y } = require('@monstrs/code-runtime')
  const { eslintConfigPrettier } = require('@monstrs/code-runtime')
  const { eslintConfigBestPractices } = require('@monstrs/code-runtime')
  const { eslintTypescriptParser } = require('@monstrs/code-runtime')
  const { eslintImportResolverNode } = require('@monstrs/code-runtime')

  return {
    parser: eslintTypescriptParser,
    extends: [
      eslintConfigBestPractices,
      eslintConfigErrors,
      eslintConfigNode,
      eslintConfigStyle,
      eslintConfigVariables,
      eslintConfigEs6,
      eslintConfigStrict,
      eslintConfigImports,
      eslintConfigReact,
      eslintConfigReactA11y,
      eslintConfigHooks,
      eslintConfigPrettier,
    ],
    plugins: ['prettier', '@typescript-eslint'],
    env: {
      node: true,
      browser: true,
      jest: true,
    },

    rules: {
      // typescript rules
      'brace-style': 'off',
      '@typescript-eslint/brace-style': baseStyleRules['brace-style'],

      camelcase: 'off',

      'func-call-spacing': 'off',
      '@typescript-eslint/func-call-spacing': baseStyleRules['func-call-spacing'],

      indent: 'off',

      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': baseStyleRules['no-array-constructor'],

      'no-extra-parens': 'off',
      '@typescript-eslint/no-extra-parens': baseErrorsRules['no-extra-parens'],

      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': baseBestPracticesRules['no-magic-numbers'],

      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': baseBestPracticesRules['no-unused-expressions'],

      'no-unused-vars': 'off',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': baseVariablesRules['no-use-before-define'],

      quotes: 'off',
      '@typescript-eslint/quotes': baseStyleRules.quotes,

      semi: 'off',

      'import/extensions': [
        baseImportsRules['import/extensions'][0],
        baseImportsRules['import/extensions'][1],
        {
          ...baseImportsRules['import/extensions'][2],
          ts: 'never',
          tsx: 'never',
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],

      // base rules
      'prettier/prettier': ['error', prettierConfig],

      'class-methods-use-this': 0,

      'import/no-cycle': 0,
      'import/no-duplicates': 0,
      'import/no-unresolved': 0,
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

      'jsx-a11y/html-has-lang': 0,

      'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
      'react/jsx-props-no-spreading': 0,
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
      'react/prop-types': 0,
      'react/no-danger': 0,

      '@typescript-eslint/semi': 0,
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],

      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',

      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'error',

      '@typescript-eslint/indent': 0,

      'no-shadow': ['error', { allow: ['ClientFactory', 'ServerBuilder'] }],
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        rules: {
          'no-undef': 'off',
        },
      },
    ],
    settings: {
      react: {
        pragma: 'React',
        version: '17.0.2',
      },
      'import/parsers': {
        [eslintTypescriptParser]: ['.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        [eslintImportResolverNode]: {
          extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
      'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx'],
    },
  }
}
