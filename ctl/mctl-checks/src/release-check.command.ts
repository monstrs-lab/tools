import execa                       from 'execa'
import { Command }                 from 'clipanion'

import { Conclusion, createCheck } from './github'

class ReleaseCheckCommand extends Command {
  @Command.Boolean(`-v,--verbose`)
  verbose: boolean = false

  @Command.Path(`check`, `release`)
  async execute() {
    try {
      const { stdout, stderr } = await execa('yarn', [
        'workspaces',
        'foreach',
        '-p',
        'run',
        'build',
      ])

      if (this.verbose) {
        if (stdout) {
          this.context.stdout.write(stdout)
        }

        if (stderr) {
          this.context.stdout.write(stderr)
        }
      }

      await this.check(stderr)
    } catch (error) {
      await this.check(error.stderr || error.message)
    }
  }

  async check(message?: any) {
    const lines = (message || '').split('\n')

    const success = lines.length === 0 || (lines.length === 1 && lines[0].includes('Done'))

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
