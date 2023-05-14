import type { SeverityNumber } from '@monstrs/logger'
import type { webpack }        from '@monstrs/code-runtime/webpack'

export interface WebpackLogRecord {
  record: webpack.StatsError
  severityNumber: SeverityNumber.ERROR | SeverityNumber.WARN
}

export type WebpackEnvironment = 'development' | 'production'

export interface WebpackConfigPlugin {
  name: string
  use: any
  args: Array<any>
}
