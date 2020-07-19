import execa                       from 'execa'
import { Command }                 from 'clipanion'

import { Conclusion, createCheck } from './github'

class ReleaseCheckCommand extends Command {
  @Command.Path(`check`, `release`)
  async execute() {
    try {
      const { all } = await execa('yarn', ['workspaces', 'foreach', '-p', 'run', 'build'], {
        all: true,
      })

      await this.check(all)
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
