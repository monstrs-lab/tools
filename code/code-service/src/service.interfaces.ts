import type { LogRecord }   from '@monstrs/logger'

import { WebpackLogRecord } from './webpack.interfaces.js'

export type ServiceLogRecord = WebpackLogRecord | Error | LogRecord
