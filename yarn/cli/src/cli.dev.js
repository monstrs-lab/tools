require(`${__dirname}/../../../.pnp.cjs`).setup()
require('@monstrs/tools-setup-ts-execution')

process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
  ? [process.env.NODE_OPTIONS, `--require ${__dirname}/../../../.pnp.cjs`].join(' ')
  : `--require ${__dirname}/../../../.pnp.cjs`

process.execArgv.push('--require')
process.execArgv.push(require.resolve('@monstrs/tools-setup-ts-execution'))

global.YARN_VERSION = `${require('@yarnpkg/cli/package.json').version}.dev`

module.exports = require('./cli')
