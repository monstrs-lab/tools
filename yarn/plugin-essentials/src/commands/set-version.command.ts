import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Option }        from 'clipanion'

export class SetVersionCommand extends BaseCommand {
  static override paths = [['set', 'version', 'from', 'tag']]

  tag = Option.String()

  async execute(): Promise<number> {
    const exitCode = await this.cli.run([
      'set',
      'version',
      `https://www.unpkg.com/@monstrs/yarn-cli@${this.tag}/dist/yarn.cjs`,
    ])

    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    await configuration.triggerHook(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (hooks) => (hooks as any).afterYarnVersionSet,
      configuration,
      this.context
    )

    return exitCode
  }
}
