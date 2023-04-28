import type { ServiceLogRecord }    from './service.interfaces.js'
import type { WebpackConfigPlugin } from './webpack.config.js'

import { PassThrough }              from 'node:stream'

import { SeverityNumber }           from '@monstrs/logger'

import { StartServerPlugin }        from '@monstrs/code-runtime/webpack'
import { webpack }                  from '@monstrs/code-runtime/webpack'

import { WebpackConfig }            from './webpack.config.js'

export class Service {
  constructor(private readonly cwd: string) {}

  async build(plugins: Array<WebpackConfigPlugin> = []): Promise<Array<ServiceLogRecord>> {
    const config = new WebpackConfig(this.cwd)

    const compiler = webpack(await config.build())

    return new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) {
          if (!error.message) {
            reject(error)
          } else {
            resolve([error])
          }
        } else if (stats) {
          const { errors = [], warnings = [] } = stats.toJson()

          resolve([
            ...errors.map((record) => ({ record, severityNumber: SeverityNumber.ERROR })),
            ...warnings.map((record) => ({ record, severityNumber: SeverityNumber.WARN })),
          ])
        } else {
          resolve([])
        }
      })
    })
  }

  async watch(callback: (logRecord: ServiceLogRecord) => void): Promise<webpack.Watching> {
    const config = new WebpackConfig(this.cwd)

    const pass = new PassThrough()

    pass.on('data', (chunk) => {
      chunk
        .toString()
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((row) => {
          try {
            callback(JSON.parse(row))
          } catch {
            callback({ severityNumber: SeverityNumber.INFO, body: row })
          }
        })
    })

    return webpack(
      await config.build('development', [
        {
          name: 'start-server',
          use: StartServerPlugin,
          args: [
            {
              stdout: pass,
              stderr: pass,
            },
          ],
        },
      ])
    ).watch({}, (error, stats) => {
      if (error) {
        callback(error)
      } else if (stats) {
        const { errors = [], warnings = [] } = stats.toJson()

        warnings.forEach((record) => callback({ record, severityNumber: SeverityNumber.WARN }))

        errors.forEach((record) => callback({ record, severityNumber: SeverityNumber.ERROR }))
      }
    })
  }
}
