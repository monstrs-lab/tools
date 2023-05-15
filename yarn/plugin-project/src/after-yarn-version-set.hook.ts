import type { Configuration }  from '@yarnpkg/core'
import type { CommandContext } from '@yarnpkg/core'
import type { MiniCli }        from 'clipanion/lib/advanced/Cli.js'

export const afterYarnVersionSet = async (
  configuration: Configuration,
  cli: MiniCli<CommandContext>
) => {
  await cli.run(['project', 'config', 'update'])
}
