import('@yarnpkg/cli/lib/polyfills')

import {YarnVersion}            from '@yarnpkg/core';

import { main } from '@yarnpkg/cli'
//import { getPluginConfiguration } from '@yarnpkg/cli'

import { getPluginConfiguration } from './getPluginConfiguration'

main({
  binaryVersion: YarnVersion || `<unknown>`,
  pluginConfiguration: getPluginConfiguration(),
})
