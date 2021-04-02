import { Command }                  from 'clipanion'
import { PassThrough }              from 'stream'

import { watch }                    from '@monstrs/code-service'
import { StartServerPlugin }        from '@monstrs/webpack-start-server-plugin'
import { StartServerPluginOptions } from '@monstrs/webpack-start-server-plugin'

import { PrettyLogsTransform }      from '@monstrs/cli-ui-pretty-logs'

const waitSignals = (watcher): Promise<void> =>
  new Promise((resolve) => {
    process.on('SIGINT', () => {
      watcher.close(() => resolve())
    })

    process.on('SIGTERM', () => {
      watcher.close(() => resolve())
    })
  })

class RendererDevCommand extends Command {
  @Command.Boolean(`-p,--pretty-logs`)
  prettyLogs: boolean = false

  @Command.String(`-s,--source`)
  source?: string

  @Command.Path(`renderer`, `dev`)
  async execute() {
    const startServerPluginArgs: Partial<StartServerPluginOptions> = {}

    if (this.prettyLogs) {
      const formatter = new PassThrough()

      startServerPluginArgs.stdout = formatter
      startServerPluginArgs.stderr = formatter

      formatter.pipe(new PrettyLogsTransform()).pipe(process.stdout)
    } else {
      startServerPluginArgs.stdout = this.context.stdout
      startServerPluginArgs.stderr = this.context.stderr
    }

    const plugins = [
      {
        name: 'start-server',
        use: StartServerPlugin,
        args: [startServerPluginArgs],
      },
    ]

    const watcher = await watch(
      { cwd: this.source || process.cwd() },
      plugins,
      (error): undefined => {
        if (error) {
          this.context.stdout.write(error)
        }

        return undefined
      }
    )

    await waitSignals(watcher)
  }
}

export { RendererDevCommand }
