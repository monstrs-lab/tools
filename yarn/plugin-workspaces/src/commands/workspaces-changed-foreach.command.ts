import { BaseCommand }            from '@yarnpkg/cli'
import { WorkspaceRequiredError } from '@yarnpkg/cli'
import { Configuration }          from '@yarnpkg/core'
import { Project }                from '@yarnpkg/core'
import { StreamReport }           from '@yarnpkg/core'
import { structUtils }            from '@yarnpkg/core'
import { Option }                 from 'clipanion'

import { getChangedFiles }        from '@monstrs/yarn-plugin-files'
import { getChangedWorkspaces }   from '@monstrs/yarn-workspace-utils'

class WorkspacesChangedForeachCommand extends BaseCommand {
  static override paths = [['workspaces', 'changed', 'foreach']]

  verbose = Option.Boolean('-v,--verbose', false)

  parallel = Option.Boolean('-p,--parallel', false)

  interlaced = Option.Boolean('-i,--interlaced', false)

  publicOnly: boolean = Option.Boolean('--no-private', false)

  topological: boolean = Option.Boolean('-t,--topological', false)

  topologicalDev: boolean = Option.Boolean('--topological-dev', false)

  jobs?: number = Option.String('-j,--jobs')

  commandName = Option.String()

  args = Option.Proxy()

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)

    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    if (!workspace) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd)
    }

    const files = await getChangedFiles(project)
    const workspaces = getChangedWorkspaces(project, files)

    if (!workspaces.length) {
      const commandReport = await StreamReport.start(
        {
          configuration,
          stdout: this.context.stdout,
        },
        async (report) => {
          report.reportInfo(null, 'No workspaces changed')
        }
      )

      return commandReport.exitCode()
    }

    const input = ['workspaces', 'foreach']

    workspaces.forEach((ws) => {
      input.push('--include')
      input.push(structUtils.stringifyIdent(ws.anchoredLocator))
    })

    if (this.verbose) {
      input.push('--verbose')
    }

    if (this.parallel) {
      input.push('--parallel')
    }

    if (this.interlaced) {
      input.push('--interlaced')
    }

    if (this.publicOnly) {
      input.push('--no-private')
    }

    if (this.topological) {
      input.push('--topological')
    }

    if (this.topologicalDev) {
      input.push('--topological-dev')
    }

    if (this.jobs) {
      input.push('--jobs')
    }

    return this.cli.run([...input, this.commandName, ...this.args], {
      cwd: project.cwd,
    })
  }
}

export { WorkspacesChangedForeachCommand }
