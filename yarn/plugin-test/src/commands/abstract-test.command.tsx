import { BaseCommand }  from '@yarnpkg/cli'
import { Option }       from 'clipanion'
import React            from 'react'

import { LogRecord }    from '@monstrs/cli-ui-log-record-component'
import { renderStatic } from '@monstrs/cli-ui-renderer'

export abstract class AbstractTestCommand extends BaseCommand {
  bail = Option.Boolean('-b,--bail', false)

  updateSnapshot = Option.Boolean('-u,--update-shapshot', false)

  findRelatedTests = Option.Boolean('-f,--find-related-tests', false)

  files: Array<string> = Option.Rest({ required: 0 })

  wrapOutput(): void {
    const original = process.stdout.write

    process.stdout.write = (value: Uint8Array | string, ...rest: Array<any>): boolean => {
      const items: Array<string> = value.toString().split('\n')

      const logRecords: Array<string> = items.map((item) => {
        try {
          const logRecord = JSON.parse(item)

          if ('severityText' in logRecord) {
            return `${renderStatic(<LogRecord {...logRecord} />)}\n`
          }

          return item
        } catch {
          return item
        }
      })

      logRecords.forEach((logRecord) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        original.bind(process.stdout)(logRecord, ...rest)
      })

      return true
    }
  }
}
