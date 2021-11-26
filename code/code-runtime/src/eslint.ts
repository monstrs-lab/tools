import { dymanicRequire } from './utils'

export const eslint = dymanicRequire.resolve('eslint')
export const eslintConfig = dymanicRequire.resolve('@monstrs/eslint-config')

export const eslintPlugins = {
  import: require('eslint-plugin-import'),
  react: require('eslint-plugin-react'),
  'jsx-a11y': require('eslint-plugin-jsx-a11y'),
  'react-hooks': require('eslint-plugin-react-hooks'),
  '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  prettier: require('eslint-plugin-prettier'),
  'eslint-plugin-react-hooks': require('eslint-plugin-react-hooks'),
  /*
    "@typescript-eslint/eslint-plugin": "^5.4.0",
      "@typescript-eslint/parser": "^5.4.0",
      "eslint-plugin-import": "^2.25.3",
      "eslint-plugin-jsx-a11y": "^6.5.1",
      "eslint-plugin-prettier": "^4.0.0",
      "eslint-plugin-react": "^7.27.1",
      "eslint-plugin-react-hooks": "^4.3.0",
      */
}
