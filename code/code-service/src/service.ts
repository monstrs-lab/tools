import webpack                 from 'webpack'
import { Watching }            from 'webpack'

import { createWebpackConfig } from './webpack'
import { WebpackConfigPlugin } from './webpack'

export interface ServiceBuildResultMessage {
  message: string
}

export interface ServiceBuildResult {
  errors: ServiceBuildResultMessage[]
  warnings: ServiceBuildResultMessage[]
}

export class Service {
  constructor(private readonly cwd: string) {}

  async build(plugins: Array<WebpackConfigPlugin> = []): Promise<ServiceBuildResult> {
    const compiler = webpack(await createWebpackConfig(this.cwd, 'production', plugins))

    return new Promise((resolve, reject) => {
      compiler.run((error, stats) => {
        if (error) {
          if (!error.message) {
            reject(error)
          } else {
            resolve({
              errors: [{ message: error.message }],
              warnings: [],
            })
          }
        } else if (stats) {
          const { errors = [], warnings = [] } = stats.toJson()

          resolve({
            // eslint-disable-next-line
            errors: errors.map((error) => ({ message: error.message })),
            warnings: warnings.map((warning) => ({ message: warning.message })),
          })
        } else {
          resolve({
            errors: [],
            warnings: [],
          })
        }
      })
    })
  }

  async watch(plugins: Array<WebpackConfigPlugin> = [], callback): Promise<Watching> {
    return webpack(await createWebpackConfig(this.cwd, 'development', plugins)).watch({}, callback)
  }
}
