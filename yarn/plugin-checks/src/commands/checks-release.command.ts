import type { Annotation }       from '../utils/index.js'

import { BaseCommand }           from '@yarnpkg/cli'
import { Configuration }         from '@yarnpkg/core'
import { Project }               from '@yarnpkg/core'
import { Filename }              from '@yarnpkg/fslib'
import { execUtils }             from '@yarnpkg/core'
import { scriptUtils }           from '@yarnpkg/core'
import { ppath }                 from '@yarnpkg/fslib'
import { xfs }                   from '@yarnpkg/fslib'
import stripAnsi                 from 'strip-ansi'

import { PassThroughRunContext } from '@monstrs/yarn-run-utils'
import { getChangedFiles }       from '@monstrs/yarn-plugin-files'
import { getChangedWorkspaces }  from '@monstrs/yarn-workspace-utils'

import { GitHubChecks }          from '../utils/index.js'
import { AnnotationLevel }       from '../utils/index.js'

class ChecksReleaseCommand extends BaseCommand {
  static override paths = [['checks', 'release']]

  override async execute(): Promise<number> {
    const nodeOptions = process.env.NODE_OPTIONS ?? ''

    if (nodeOptions.includes(Filename.pnpCjs) && nodeOptions.includes(Filename.pnpEsmLoader)) {
      return this.executeRegular()
    }

    return this.executeProxy()
  }

  async executeProxy(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const binFolder = await xfs.mktempPromise()

    const { code } = await execUtils.pipevp('yarn', ['checks', 'release'], {
      cwd: this.context.cwd,
      stdin: this.context.stdin,
      stdout: this.context.stdout,
      stderr: this.context.stderr,
      env: await scriptUtils.makeScriptEnv({ binFolder, project }),
    })

    return code
  }

  async executeRegular(): Promise<number> {
    const { project } = await Project.find(
      await Configuration.find(this.context.cwd, this.context.plugins),
      this.context.cwd
    )

    const workspaces = getChangedWorkspaces(project, await getChangedFiles(project))

    const checks = new GitHubChecks('release')

    const { id: checkId } = await checks.start()

    try {
      const annotations: Array<Annotation> = []

      const outputWritter = (data: Buffer): boolean => this.context.stdout.write(data)

      for await (const workspace of workspaces) {
        if (workspace.manifest.scripts.get('build')) {
          const context: PassThroughRunContext = new PassThroughRunContext()

          context.stdout.on('data', outputWritter)
          context.stderr.on('data', outputWritter)

          const code = await this.cli.run(
            ['workspace', workspace.manifest.raw.name as string, 'build'],
            context
          )

          if (code > 0) {
            annotations.push({
              annotation_level: AnnotationLevel.Failure,
              title: `Error release workspace ${
                (workspace.manifest.raw.name as string) || workspace.relativeCwd
              }`,
              message: `Exit code ${code}`,
              raw_details: stripAnsi(context.output),
              path: ppath.join(workspace.relativeCwd, 'package.json'),
              start_line: 1,
              end_line: 1,
            })
          }

          context.stdout.off('data', outputWritter)
          context.stderr.off('data', outputWritter)
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
        summary: error instanceof Error ? error.message : (error as string),
      })
    }

    return 0
  }
}

export { ChecksReleaseCommand }
