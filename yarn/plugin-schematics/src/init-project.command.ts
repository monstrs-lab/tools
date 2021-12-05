import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'

import { Schematics }    from '@monstrs/code-schematics'

class InitProjectCommand extends BaseCommand {
  static paths = [['init', 'project']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const schematics = new Schematics(project.cwd)

    await schematics.init('project')
  }
}

export { InitProjectCommand }
