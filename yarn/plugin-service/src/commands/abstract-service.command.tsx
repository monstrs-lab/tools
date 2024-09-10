import type { ServiceLogRecord } from '@monstrs/code-service'

import { SeverityNumber }        from '@monstrs/logger'
import { BaseCommand }           from '@yarnpkg/cli'
import { Option }                from 'clipanion'
import React                     from 'react'

import { ErrorInfo }             from '@monstrs/cli-ui-error-info'
import { LogRecord }             from '@monstrs/cli-ui-log-record'
import { renderStatic }          from '@monstrs/cli-ui-renderer-static'

export abstract class AbstractServiceCommand extends BaseCommand {
  showWarnings = Option.Boolean('-w,--show-warnings', false)

  renderLogRecord(logRecord: ServiceLogRecord): void {
    if (logRecord instanceof Error) {
      renderStatic(<ErrorInfo error={logRecord} />)
        .split('\n')
        .forEach((line) => {
          console.log(line) // eslint-disable-line no-console
        })
    } else if ('severityNumber' in logRecord && 'record' in logRecord) {
      renderStatic(<ErrorInfo error={logRecord.record as Error} />)
        .split('\n')
        .forEach((line) => {
          if (logRecord.severityNumber === SeverityNumber.WARN) {
            if (this.showWarnings) {
              console.log(line) // eslint-disable-line no-console
            }
          } else {
            console.log(line) // eslint-disable-line no-console
          }
        })
    } else if ('severityNumber' in logRecord) {
      renderStatic(<LogRecord {...logRecord} />)
        .split('\n')
        .forEach((line) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (logRecord.severityNumber! <= SeverityNumber.INFO) {
            console.log(line) // eslint-disable-line no-console
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          } else if (logRecord.severityNumber! <= SeverityNumber.WARN) {
            if (this.showWarnings) {
              console.log(line) // eslint-disable-line no-console
            }
          } else {
            console.log(line) // eslint-disable-line no-console
          }
        })
    } else {
      // eslint-disable-next-line no-console
      console.log(`Unknown record type: ${JSON.stringify(logRecord)}`)
    }
  }
}
