const prettierConfig = require('@monstrs/prettier-config')

const parser = require.resolve('@typescript-eslint/parser')
const resolver = require.resolve('eslint-import-resolver-node')

const rules = require('./rules')

module.exports = {
  parser,
  env: { node: true, browser: true, jest: true, es6: true },
  globals: {},
  noInlineConfig: undefined,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['import', 'react', 'jsx-a11y', 'react-hooks', '@typescript-eslint', 'prettier'],
  reportUnusedDisableDirectives: true,

  rules: {
    ...rules,
    'prettier/prettier': ['error', prettierConfig],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '.mts', '.mtsx'],
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
      [parser]: ['.ts', '.tsx', '.mts', '.mtsx', '.d.ts'],
    },
    'import/resolver': {
      [resolver]: {
        extensions: ['.mjs', '.mts', '.mtsx', '.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx', '.mts', '.mtsx'],
    propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
  },
}

/*
module.exports.plugins = {
  import: require('eslint-plugin-import'),
  react: require('eslint-plugin-react'),
  'jsx-a11y': require('eslint-plugin-jsx-a11y'),
  'react-hooks': require('eslint-plugin-react-hooks'),
  '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  'prettier': require('eslint-plugin-prettier')
  
  "@typescript-eslint/eslint-plugin": "^5.4.0",
    "@typescript-eslint/parser": "^5.4.0",
    "eslint-plugin-import": "^2.25.3",
    "eslint-plugin-jsx-a11y": "^6.5.1",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.27.1",
    "eslint-plugin-react-hooks": "^4.3.0",
    
}
*/
