import { BaseCommand }    from '@yarnpkg/cli'
import { Configuration }  from '@yarnpkg/core'
import { Project }        from '@yarnpkg/core'
import { Option }         from 'clipanion'
import { render }         from 'ink'
import React              from 'react'

import { ErrorInfo }      from '@monstrs/cli-ui-error-info-component'
import { FormatProgress } from '@monstrs/cli-ui-format-progress-component'
import { Formatter }      from '@monstrs/code-format'
import { renderStatic }   from '@monstrs/cli-ui-renderer'

export class FormatCommand extends BaseCommand {
  static override paths = [['format']]

  files: Array<string> = Option.Rest({ required: 0 })

  async execute(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const formatter = await Formatter.initialize(this.context.cwd)

    const { clear } = render(<FormatProgress cwd={project.cwd} formatter={formatter} />)

    try {
      await formatter.format(this.files)

      return 0
    } catch (error) {
      if (error instanceof Error) {
        renderStatic(<ErrorInfo error={error} />, process.stdout.columns)
          .split('\n')
          .forEach((line) => {
            console.error(`${line}\n`) // eslint-disable-line no-console
          })
      } else {
        console.error(error) // eslint-disable-line no-console
      }

      return 1
    } finally {
      clear()
    }
  }
}
