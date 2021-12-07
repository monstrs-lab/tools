import { BaseCommand }                    from '@yarnpkg/cli'
import { Configuration }                  from '@yarnpkg/core'
import { Project }                        from '@yarnpkg/core'
import { renderForm }                     from '@yarnpkg/libui/sources/misc/renderForm'

import { forceStdinTty }                  from 'force-stdin-tty'

import { SubmitInjectedComponentFactory } from '@monstrs/cli-ui-parts'
import { RequestProjectInformation }      from '@monstrs/cli-ui-schematics-component'
import { ProjectInformationProperties }   from '@monstrs/cli-ui-schematics-component'
import { Schematics }                     from '@monstrs/code-schematics'

class InitProjectCommand extends BaseCommand {
  static paths = [['init', 'project']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const overwroteStdin = forceStdinTty()

    const options: ProjectInformationProperties | undefined = await renderForm(
      SubmitInjectedComponentFactory<ProjectInformationProperties>(RequestProjectInformation),
      {}
    )

    if (overwroteStdin) {
      process.stdin.destroy()
    }

    if (!options) {
      return 1
    }

    const schematics = new Schematics(project.cwd)

    await schematics.init('project', options)

    return 0
  }
}

export { InitProjectCommand }
