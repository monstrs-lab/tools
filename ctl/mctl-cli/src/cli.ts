import { Cli }                                       from 'clipanion'

import { TypeCheckCommand as CheckTypeCommand }      from '@monstrs/mctl-checks'
import { LintCheckCommand, TestCheckCommand }        from '@monstrs/mctl-checks'
import { ReleaseCheckCommand }                       from '@monstrs/mctl-checks'
import { CommitCommand }                             from '@monstrs/mctl-commit'
import { CommitmsgCommand }                          from '@monstrs/mctl-commitmsg'
import { DockerBuildCommand }                        from '@monstrs/mctl-docker'
import { FormatCommand }                             from '@monstrs/mctl-format'
import { GithubCreateDeploymentCommand }             from '@monstrs/mctl-github'
import { LintCommand }                               from '@monstrs/mctl-lint'
import { PreCommitCommand }                          from '@monstrs/mctl-precommit'
import { FormatStagedCommand, LintStagedCommand }    from '@monstrs/mctl-precommit'
import { TestStagedCommand, TypeCheckStagedCommand } from '@monstrs/mctl-precommit'
import { TestCommand }                               from '@monstrs/mctl-test'
import { TypeCheckCommand }                          from '@monstrs/mctl-typecheck'

import { binaryVersion }                             from './constants'

const run = () => {
  const cli = new Cli({
    binaryLabel: `Monstrs Command Line Interface`,
    binaryName: `mctl`,
    binaryVersion,
  })

  cli.register(LintCommand)
  cli.register(FormatCommand)
  cli.register(TypeCheckCommand)
  cli.register(TestCommand)

  cli.register(CommitCommand)
  cli.register(CommitmsgCommand)

  cli.register(PreCommitCommand)
  cli.register(LintStagedCommand)
  cli.register(FormatStagedCommand)
  cli.register(TypeCheckStagedCommand)
  cli.register(TestStagedCommand)

  cli.register(CheckTypeCommand)
  cli.register(LintCheckCommand)
  cli.register(TestCheckCommand)
  cli.register(ReleaseCheckCommand)

  cli.register(DockerBuildCommand)

  cli.register(GithubCreateDeploymentCommand)

  try {
    cli.runExit(process.argv.slice(2), {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
    })
  } catch (error) {
    process.stdout.write(error.stack || error.message)
    process.exitCode = 1
  }
}

export { run }
