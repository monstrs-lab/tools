import type { SeverityNumber } from '@monstrs/logger'
import type { webpack }        from '@monstrs/tools-runtime/webpack'

export interface WebpackLogRecord {
  record: webpack.StatsError
  severityNumber: SeverityNumber.ERROR | SeverityNumber.WARN
}

export type WebpackEnvironment = 'development' | 'production'

export interface WebpackConfigPlugin {
  name: string
  use: unknown
  args: Array<unknown>
}
