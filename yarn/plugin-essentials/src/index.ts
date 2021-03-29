import { Plugin }       from '@yarnpkg/core'

import TypeScriptPlugin from '@monstrs/yarn-plugin-typescript'
import FormatPlugin     from '@monstrs/yarn-plugin-format'
import CommitPlugin     from '@monstrs/yarn-plugin-commit'
import LintPlugin       from '@monstrs/yarn-plugin-lint'
import TestPlugin       from '@monstrs/yarn-plugin-test'
import HuskyPlugin      from '@monstrs/yarn-plugin-husky'
import WorkspacesPlugin from '@monstrs/yarn-plugin-workspaces'
import FilesPlugin      from '@monstrs/yarn-plugin-files'
import AppPlugin        from '@monstrs/yarn-plugin-app'
import GitHubPlug       from '@monstrs/yarn-plugin-github'

import { mergePlugins } from './merge-plugins.util'

const plugin: Plugin = mergePlugins([
  TypeScriptPlugin,
  WorkspacesPlugin,
  FormatPlugin,
  CommitPlugin,
  HuskyPlugin,
  FilesPlugin,
  LintPlugin,
  TestPlugin,
  GitHubPlug,
  AppPlugin,
])

export default plugin
