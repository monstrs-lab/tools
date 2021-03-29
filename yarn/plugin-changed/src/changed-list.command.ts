import { BaseCommand }            from '@yarnpkg/cli'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { StreamReport }           from '@yarnpkg/core'
import { structUtils }            from '@yarnpkg/core'
import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { Command }                from 'clipanion'

import { getChangedWorkspaces }   from '@monstrs/yarn-workspace-utils'

import { getLocalChangedFiles }   from './changed-files.util'

class ChangedListCommand extends BaseCommand {
  @Command.Boolean('--json')
  public json = false

  @Command.Path('workspaces', 'changed', 'list')
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
      // eslint-disable-next-line no-shadow
      async (report) => {
        const changedFiles = await getLocalChangedFiles(project)
        const workspaces = getChangedWorkspaces(project, changedFiles)

        // eslint-disable-next-line no-restricted-syntax
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

export { ChangedListCommand }
