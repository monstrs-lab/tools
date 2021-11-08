/* eslint-disable global-require */

/* eslint-disable-next-line import/no-dynamic-require */
require(`${__dirname}/../../../.pnp.cjs`).setup()
require('@monstrs/tools-setup-ts-execution')

process.env.TOOLS_DEV_MODE = '1'

process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
  ? [process.env.NODE_OPTIONS, `--require ${__dirname}/../../../.pnp.cjs`].join(' ')
  : `--require ${__dirname}/../../../.pnp.cjs`

global.YARN_VERSION = `${require(`@yarnpkg/cli/package.json`).version}.dev`

module.exports = require(`./cli`)
