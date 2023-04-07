import { createRequire }     from 'node:module'

import webpack               from 'webpack'

import { StartServerPlugin } from '@monstrs/webpack-start-server-plugin'

const require = createRequire(import.meta.url)

const tsLoaderPath = require.resolve('ts-loader')
const webpackProtoImportsLoaderPath = require.resolve('@monstrs/webpack-proto-imports-loader')

export { webpack, StartServerPlugin, tsLoaderPath, webpackProtoImportsLoaderPath }
