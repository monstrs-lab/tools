import { Plugin }       from '@yarnpkg/core'

import TypeScriptPlugin from '@monstrs/yarn-plugin-typescript'
import FormatPlugin     from '@monstrs/yarn-plugin-format'
import CommitPlugin     from '@monstrs/yarn-plugin-commit'
import LintPlugin       from '@monstrs/yarn-plugin-lint'
import TestPlugin       from '@monstrs/yarn-plugin-test'
import HuskyPlugin      from '@monstrs/yarn-plugin-husky'
import ChangedPlugin    from '@monstrs/yarn-plugin-changed'
import FilesPlugin      from '@monstrs/yarn-plugin-files'

import { mergePlugins } from './merge-plugins.util'

const plugin: Plugin = mergePlugins([
  TypeScriptPlugin,
  FormatPlugin,
  CommitPlugin,
  LintPlugin,
  TestPlugin,
  HuskyPlugin,
  ChangedPlugin,
  FilesPlugin,
])

export default plugin
