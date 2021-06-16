import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { BaseCommand }   from '@yarnpkg/cli'

class TypeCheckCommand extends BaseCommand {
  static paths = [['typecheck']]

  async execute() {
    const { project } = await Project.find(
      await Configuration.find(this.context.cwd, this.context.plugins),
      this.context.cwd
    )

    const patterns = project.topLevelWorkspace.manifest.workspaceDefinitions.map(
      (definition) => definition.pattern
    )

    await this.cli.run(['mctl', 'typecheck', ...patterns])
  }
}

export { TypeCheckCommand }
