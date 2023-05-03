import type { webpack }   from '@monstrs/code-runtime/webpack'

import { SeverityNumber } from '@monstrs/logger'

export interface WebpackLogRecord {
  record: webpack.StatsError
  severityNumber: SeverityNumber.WARN | SeverityNumber.ERROR
}

export type WebpackEnvironment = 'production' | 'development'

export interface WebpackConfigPlugin {
  name: string
  use: any
  args: any[]
}
