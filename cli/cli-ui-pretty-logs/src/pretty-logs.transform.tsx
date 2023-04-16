/* eslint-disable consistent-return */

import { EOL }          from 'node:os'
import { Transform }    from 'node:stream'

import React            from 'react'

import { LogRecord }    from '@monstrs/cli-ui-log-record-component'
import { renderStatic } from '@monstrs/cli-ui-renderer'

export class PrettyLogsTransform extends Transform {
  parse(row) {
    try {
      if (row) {
        const data = JSON.parse(row)

        if (data && !data.body) {
          return {
            body: data,
          }
        }

        return data
      }
    } catch (error) {
      return {
        body: row,
      }
    }
  }

  render(data = {}) {
    return renderStatic(<LogRecord {...data} />)
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, callback) {
    const parts = chunk.toString().split(/\r?\n/)

    parts
      .map(this.parse)
      .filter(Boolean)
      .map(this.render)
      .forEach((row) => {
        this.push(`${row}${EOL}`)
      })

    callback()
  }
}
