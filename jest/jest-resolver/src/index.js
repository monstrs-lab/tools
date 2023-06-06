/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const tsJestResolver = require('ts-jest-resolver')

module.exports = (request, options) => {
  if (request === 'pnpapi') {
    return require.resolve('pnpapi', { paths: [options.basedir] })
  }

  return tsJestResolver(request, options)
}
