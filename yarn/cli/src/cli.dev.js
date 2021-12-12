const { join } = require('node:path')

require(`${__dirname}/../../../.pnp.cjs`).setup()
require('@monstrs/tools-setup-ts-execution')

process.execArgv.push('--require')
process.execArgv.push(join(process.cwd(), '.pnp.cjs'))

process.execArgv.push('--require')
process.execArgv.push(require.resolve('@monstrs/tools-setup-ts-execution'))

global.YARN_VERSION = `${require('@yarnpkg/cli/package.json').version}.dev`

module.exports = require('./cli')
