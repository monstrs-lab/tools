import { BaseCommand }                 from '@yarnpkg/cli'
import { Configuration }               from '@yarnpkg/core'
import { Project }                     from '@yarnpkg/core'
import { ppath }                       from '@yarnpkg/fslib'
import { toFilename }                  from '@yarnpkg/fslib'
import stripAnsi                       from 'strip-ansi'

import { getChangedWorkspaces }        from '@monstrs/yarn-workspace-utils'
import { getChangedFiles }             from '@monstrs/yarn-plugin-files'
import { PassThroughRunContext }       from '@monstrs/yarn-run-utils'

import { GitHubChecks }     from './github.checks'
import { AnnotationLevel }  from './github.checks'
import { Annotation }       from './github.checks'

class ChecksReleaseCommand extends BaseCommand {
  static paths = [['checks', 'release']]

  async execute() {
    const { project } = await Project.find(
      await Configuration.find(this.context.cwd, this.context.plugins),
      this.context.cwd
    )

    const workspaces = getChangedWorkspaces(project, await getChangedFiles(project))

    const checks = new GitHubChecks('Release')

    const { id: checkId } = await checks.start()

    try {
      const annotations: Array<Annotation> = []

      // eslint-disable-next-line no-restricted-syntax
      for (const workspace of workspaces) {
        if (workspace.manifest.scripts.get('build')) {
          const context = new PassThroughRunContext()

          // eslint-disable-next-line no-await-in-loop
          const code = await this.cli.run(
            ['workspace', workspace.manifest.raw.name, 'build'],
            context
          )

          if (code > 0) {
            annotations.push({
              annotation_level: AnnotationLevel.Failure,
              title: `Error release workspace ${workspace.manifest.raw.name}`,
              message: `Exit code ${code}`,
              raw_details: stripAnsi(context.output),
              path: ppath.join(workspace.relativeCwd, toFilename('package.json')),
              start_line: 1,
              end_line: 1,
            })
          }
        }
      }

      await checks.complete(checkId, {
        title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
        summary:
          annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
        annotations,
      })
    } catch (error) {
      await checks.failure({
        title: 'Release run failed',
        summary: (error as any).message,
      })
    }
  }
}

export { ChecksReleaseCommand }
