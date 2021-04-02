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
import GitHubPlugin     from '@monstrs/yarn-plugin-github'
import ChecksPlugin     from '@monstrs/yarn-plugin-checks'

import { mergePlugins } from './merge-plugins.util'

const plugin: Plugin = mergePlugins([
  TypeScriptPlugin,
  WorkspacesPlugin,
  FormatPlugin,
  CommitPlugin,
  GitHubPlugin,
  ChecksPlugin,
  HuskyPlugin,
  FilesPlugin,
  LintPlugin,
  TestPlugin,
  AppPlugin,
])

export default plugin
