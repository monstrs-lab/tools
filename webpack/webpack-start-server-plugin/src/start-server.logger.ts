import { Writable } from 'node:stream'

export interface StartServerLoggerOptions {
  stdout?: Writable
  stderr?: Writable
}

export class StartServerLogger {
  constructor(private readonly options: StartServerLoggerOptions = {}) {}

  info(body) {
    if (this.options.stdout) {
      this.options.stdout.write(
        Buffer.from(
          JSON.stringify({
            body,
            severityNumber: 9,
            attributes: {
              '@namespace': 'webpack:start-server',
            },
          })
        )
      )
    }
  }

  error(error) {
    if (this.options.stderr) {
      this.options.stderr.write(
        Buffer.from(
          JSON.stringify({
            body: error.message,
            severityNumber: 17,
            attributes: {
              '@namespace': 'webpack:start-server',
              '@stack': error.stack,
            },
          })
        )
      )
    }
  }
}
