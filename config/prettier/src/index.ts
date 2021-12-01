export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  plugins: [
    require.resolve('@monstrs/prettier-typescript-plugin'),
    require.resolve('prettier-plugin-packagejson'),
  ],
  printWidth: 100,
}
