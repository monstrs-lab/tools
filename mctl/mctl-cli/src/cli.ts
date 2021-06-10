import { Cli }                    from 'clipanion'

import { CommitCommand }          from '@monstrs/mctl-commit'
import { FormatCommand }          from '@monstrs/mctl-format'
import { LibraryBuildCommand }    from '@monstrs/mctl-library'
import { LintCommand }            from '@monstrs/mctl-lint'
import { ServiceBuildCommand }    from '@monstrs/mctl-service'
import { ServiceDevCommand }      from '@monstrs/mctl-service'
import { RendererBuildCommand }   from '@monstrs/mctl-renderer'
import { RendererDevCommand }     from '@monstrs/mctl-renderer'
import { TestIntegrationCommand } from '@monstrs/mctl-test'
import { TestUnitCommand }        from '@monstrs/mctl-test'
import { TypeCheckCommand }       from '@monstrs/mctl-typecheck'

import { binaryVersion }          from './constants'

const run = () => {
  const cli = new Cli({
    binaryLabel: `Monstrs Command Line Interface`,
    binaryName: `mctl`,
    binaryVersion,
  })

  cli.register(LintCommand)
  cli.register(FormatCommand)
  cli.register(TypeCheckCommand)

  cli.register(TestIntegrationCommand)
  cli.register(TestUnitCommand)

  cli.register(CommitCommand)

  cli.register(ServiceBuildCommand)
  cli.register(ServiceDevCommand)

  cli.register(RendererBuildCommand)
  cli.register(RendererDevCommand)

  cli.register(LibraryBuildCommand)

  cli
    .runExit(process.argv.slice(2), {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    })
    .catch((error) => {
      process.stdout.write(error.stack || error.message)
      process.exitCode = 1
    })
    .finally(() => process.exit())
}

export { run }
