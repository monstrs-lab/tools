import { BaseCommand }                    from '@yarnpkg/cli'
import { Configuration }                  from '@yarnpkg/core'
import { Project }                        from '@yarnpkg/core'
import { MessageName }                    from '@yarnpkg/core'
import { StreamReport }                   from '@yarnpkg/core'
import { xfs }                            from '@yarnpkg/fslib'
import { npath }                          from '@yarnpkg/fslib'
import { renderForm }                     from '@yarnpkg/libui/sources/misc/renderForm'

import React                              from 'react'
import { forceStdinTty }                  from 'force-stdin-tty'

import { ErrorInfo }                      from '@monstrs/cli-ui-error-info-component'
import { SubmitInjectedComponentFactory } from '@monstrs/cli-ui-parts'
import { RequestProjectInformation }      from '@monstrs/cli-ui-schematics-component'
import { ProjectInformationProperties }   from '@monstrs/cli-ui-schematics-component'
import { Schematics }                     from '@monstrs/code-schematics'
import { SpinnerProgress }                from '@monstrs/yarn-run-utils'
import { renderStatic }                   from '@monstrs/cli-ui-renderer'

class InitProjectCommand extends BaseCommand {
  static paths = [['init', 'project']]

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

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

    const commandReport = await StreamReport.start(
      {
        stdout: this.context.stdout,
        configuration,
      },
      async (report) => {
        await report.startTimerPromise('Init Project', async () => {
          const progress = new SpinnerProgress(this.context.stdout, configuration)

          progress.start()

          try {
            const events = await schematics.init('project', options)

            progress.end()

            events.forEach((event) => {
              const eventPath = event.path.startsWith('/') ? event.path.substr(1) : event.path

              if (event.kind === 'error') {
                report.reportError(MessageName.UNNAMED, `${eventPath}: ${event.description}`)
              } else {
                report.reportInfo(MessageName.UNNAMED, `${eventPath}: ${event.kind}`)
              }
            })

            await xfs.writeJsonPromise(
              npath.toPortablePath(
                npath.join(npath.fromPortablePath(workspace!.cwd), 'package.json')
              ),
              {
                ...workspace!.manifest.raw,
                schematic: {
                  collection: '@monstrs/schematics',
                  schematic: 'project',
                  type: options.type,
                  migration: 0,
                },
              }
            )
          } catch (error) {
            progress.end()

            renderStatic(<ErrorInfo error={error as Error} />, process.stdout.columns - 12)
              .split('\n')
              .forEach((line) => {
                report.reportError(MessageName.UNNAMED, line)
              })
          }
        })
      }
    )

    return commandReport.exitCode()
  }
}

export { InitProjectCommand }
