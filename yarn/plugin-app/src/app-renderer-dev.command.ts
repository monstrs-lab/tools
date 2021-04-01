import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { Command }       from 'clipanion'

class AppRendererDevCommand extends BaseCommand {
  @Command.Path('app', 'renderer', 'dev')
  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project } = await Project.find(configuration, this.context.cwd)

    // TODO; add '--pretty-logs' option
    await this.cli.run(['mctl', 'renderer', 'dev', '--source', this.context.cwd], {
      cwd: project.cwd,
    })
  }
}

export { AppRendererDevCommand }
