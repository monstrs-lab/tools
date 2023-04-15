import { createRequire }     from 'node:module'

import webpack               from 'webpack'

import { StartServerPlugin } from '@monstrs/webpack-start-server-plugin'

const require = createRequire(import.meta.url)

const tsLoaderPath = require.resolve('ts-loader')
const nodeLoaderPath = require.resolve('node-loader')
const stringReplaceLoaderPath = require.resolve('string-replace-loader')

export { webpack, StartServerPlugin, tsLoaderPath, nodeLoaderPath, stringReplaceLoaderPath }
