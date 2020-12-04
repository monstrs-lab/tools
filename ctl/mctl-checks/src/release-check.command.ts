import execa                       from 'execa'
import { Command }                 from 'clipanion'

import { Conclusion, createCheck } from './github'

class ReleaseCheckCommand extends Command {
  @Command.Boolean(`-v,--verbose`)
  verbose: boolean = false

  @Command.Path(`check`, `release`)
  async execute() {
    try {
      const { stdout, stderr, exitCode } = await execa('yarn', [
        'workspaces',
        'foreach',
        '--parallel',
        '--verbose',
        'run',
        'build',
      ])

      if (this.verbose) {
        this.context.stdout.write(`exit code: ${exitCode}\n`)

        if (stdout) {
          this.context.stdout.write(`stdout: ${stdout}\n`)
        }

        if (stderr) {
          this.context.stdout.write(`stderr: ${stderr}\n`)
        }
      }

      await this.check(stderr)
    } catch (error) {
      if (this.verbose) {
        this.context.stdout.write(`error: ${error.stderr || error.message}\n`)
      }

      await this.check(error.stderr || error.message)
    }
  }

  async check(message?: any) {
    const lines = (message || '')
      .trim()
      .split('\n')
      .filter((line) => line)

    const success = lines.length === 0

    const summary = lines
      .map((line) => {
        const [, ...parts] = line.split(':')
        return (parts || []).length > 0 ? parts.join(':') : ''
      })
      .join('\n')

    await createCheck('Release', success ? Conclusion.Success : Conclusion.Failure, {
      title: success ? 'Successful' : 'Error build release',
      summary,
      annotations: [],
    })
  }
}

export { ReleaseCheckCommand }
