import type { Linter } from 'eslint'

export const rules: Linter.RulesRecord = {
  '@typescript-eslint/brace-style': 'off',
  '@typescript-eslint/func-call-spacing': 'off',
  '@typescript-eslint/no-array-constructor': ['error'],
  '@typescript-eslint/adjacent-overload-signatures': ['error'],
  '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
  '@typescript-eslint/consistent-type-exports': [
    'error',
    {
      fixMixedExportsWithInlineTypeSpecifier: false,
    },
  ],
  '@typescript-eslint/method-signature-style': ['error'],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'separate-type-imports',
    },
  ],
  '@typescript-eslint/explicit-function-return-type': 'error',
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/no-base-to-string': 'error',
  '@typescript-eslint/no-confusing-void-expression': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-duplicate-type-constituents': 'error',
  '@typescript-eslint/no-dynamic-delete': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/no-for-in-array': 'error',
  '@typescript-eslint/no-import-type-side-effects': 'error',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/no-mixed-enums': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
  '@typescript-eslint/no-redundant-type-constituents': 'error',
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-qualifier': 'error',
  '@typescript-eslint/no-unnecessary-type-arguments': 'error',
  '@typescript-eslint/no-unnecessary-type-assertion': 'error',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-unsafe-declaration-merging': 'error',
  '@typescript-eslint/no-unsafe-enum-comparison': 'error',
  '@typescript-eslint/no-useless-empty-export': 'error',
  '@typescript-eslint/no-var-requires': 'error',
  '@typescript-eslint/non-nullable-type-assertion-style': 'error',
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-enum-initializers': 'error',
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/prefer-function-type': 'error',
  '@typescript-eslint/prefer-includes': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/prefer-reduce-type-parameter': 'error',
  '@typescript-eslint/prefer-string-starts-ends-with': 'error',
  '@typescript-eslint/prefer-ts-expect-error': 'error',
  '@typescript-eslint/promise-function-async': 'error',
  '@typescript-eslint/require-array-sort-compare': 'error',
  '@typescript-eslint/restrict-plus-operands': 'error',
  '@typescript-eslint/restrict-template-expressions': 'error',
  '@typescript-eslint/sort-type-constituents': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksConditionals: true,
      checksVoidReturn: true,
      checksSpreads: true,
    },
  ],
  '@typescript-eslint/ban-types': ['error'],
  '@typescript-eslint/array-type': [
    'error',
    {
      default: 'generic',
    },
  ],
  '@typescript-eslint/no-extra-parens': 'off',
  '@typescript-eslint/no-magic-numbers': [
    'off',
    {
      ignore: [],
      ignoreArrayIndexes: true,
      enforceConst: true,
      detectObjects: false,
    },
  ],
  '@typescript-eslint/no-unused-expressions': [
    'error',
    {
      allowShortCircuit: false,
      allowTernary: false,
      allowTaggedTemplates: false,
      enforceForJSX: false,
    },
  ],
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      functions: true,
      classes: true,
      variables: true,
    },
  ],
  '@typescript-eslint/quotes': 'off',
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
  '@typescript-eslint/semi': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'none',
    },
  ],
  '@typescript-eslint/no-useless-constructor': ['error'],
  '@typescript-eslint/no-empty-function': ['error'],
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/no-shadow': [
    'error',
    {
      allow: ['ClientFactory', 'ServerBuilder'],
      builtinGlobals: false,
      hoist: 'functions',
    },
  ],
  '@typescript-eslint/comma-dangle': 'off',
  '@typescript-eslint/comma-spacing': 'off',
  '@typescript-eslint/keyword-spacing': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/no-extra-semi': 'off',
  '@typescript-eslint/object-curly-spacing': 'off',
  '@typescript-eslint/space-before-function-paren': 'off',
  '@typescript-eslint/space-infix-ops': 'off',
  '@typescript-eslint/type-annotation-spacing': 'off',
}
