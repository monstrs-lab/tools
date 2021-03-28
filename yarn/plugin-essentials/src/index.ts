import { Plugin }                 from '@yarnpkg/core'

import { TypeCheckCommand }       from '@monstrs/yarn-plugin-typescript'
import { TestIntegrationCommand } from '@monstrs/yarn-plugin-test'
import { TestUnitCommand }        from '@monstrs/yarn-plugin-test'
import { CommitCommand }          from '@monstrs/yarn-plugin-commit'
import { FormatCommand }          from '@monstrs/yarn-plugin-format'
import { LintCommand }            from '@monstrs/yarn-plugin-lint'

const plugin: Plugin = {
  commands: [
    CommitCommand,
    TypeCheckCommand,
    FormatCommand,
    LintCommand,
    TestIntegrationCommand,
    TestUnitCommand,
  ],
}

export default plugin
