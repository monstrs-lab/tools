require(`${__dirname}/../../../.pnp.cjs`).setup()
require('@monstrs/tools-setup-ts-execution')

//if not pnp in require node options
process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
  ? [process.env.NODE_OPTIONS, `--require ${__dirname}/../../../.pnp.cjs`].join(' ')
  : `--require ${__dirname}/../../../.pnp.cjs`

global.YARN_VERSION = `${require(`@yarnpkg/cli/package.json`).version}.dev`

module.exports = require(`./cli`)
