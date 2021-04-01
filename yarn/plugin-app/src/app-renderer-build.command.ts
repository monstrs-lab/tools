import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { Command }       from 'clipanion'

class AppRendererBuildCommand extends BaseCommand {
  @Command.Path('app', 'renderer', 'build')
  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    await this.cli.run(['mctl', 'renderer', 'build', '--source', this.context.cwd], {
      cwd: project.cwd,
    })
  }
}

export { AppRendererBuildCommand }
