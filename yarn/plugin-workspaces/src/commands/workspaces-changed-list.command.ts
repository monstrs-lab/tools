import { BaseCommand }            from '@yarnpkg/cli'
import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { StreamReport }           from '@yarnpkg/core'
import { structUtils }            from '@yarnpkg/core'
import { Option }                 from 'clipanion'

import { getChangedFiles }        from '@monstrs/yarn-plugin-files'
import { getChangedWorkspaces }   from '@monstrs/yarn-workspace-utils'

class WorkspacesChangedListCommand extends BaseCommand {
  static paths = [['workspaces', 'changed', 'list']]

  json = Option.Boolean('--json', false)

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    const report = await StreamReport.start(
      {
        configuration,
        json: this.json,
        stdout: this.context.stdout,
      },
      // eslint-disable-next-line @typescript-eslint/no-shadow
      async (report) => {
        const files = await getChangedFiles(project)
        const workspaces = getChangedWorkspaces(project, files)

        for (const ws of workspaces) {
          report.reportInfo(null, ws.relativeCwd)
          report.reportJson({
            name: ws.manifest.name ? structUtils.stringifyIdent(ws.manifest.name) : null,
            location: ws.relativeCwd,
          })
        }
      }
    )

    return report.exitCode()
  }
}

export { WorkspacesChangedListCommand }
