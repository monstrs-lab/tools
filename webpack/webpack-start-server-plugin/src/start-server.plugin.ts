import { ChildProcess }      from 'node:child_process'
import { fork }              from 'node:child_process'
import { join }              from 'node:path'
import { Writable }          from 'node:stream'

import webpack               from 'webpack'

import { StartServerLogger } from './start-server.logger.js'

export interface StartServerPluginOptions {
  entryName?: string
  stdout?: Writable
  stderr?: Writable
}

export class StartServerPlugin {
  options: StartServerPluginOptions

  entryFile: string | null = null

  worker: ChildProcess | null = null

  initialized: boolean = false

  logger: StartServerLogger

  constructor(options: Partial<StartServerPluginOptions> = {}) {
    this.logger = new StartServerLogger(options)
    this.options = {
      entryName: 'index',
      ...options,
    }
  }

  private afterEmit = (compilation: webpack.Compilation, callback: () => void): void => {
    if (!this.initialized) {
      this.initialized = true

      callback()
    } else {
      if (this.worker?.connected && this.worker?.pid) {
        process.kill(this.worker.pid)
      }

      this.startServer(compilation, callback)
    }
  }

  apply = (compiler: webpack.Compiler): void => {
    compiler.hooks.afterEmit.tapAsync({ name: 'StartServerPlugin' }, this.afterEmit)
  }

  private startServer = (compilation: webpack.Compilation, callback: () => void): void => {
    this.logger.info('Start server...')

    this.entryFile = join(compilation.compiler.options.output.path!, 'index.js')

    this.runWorker(this.entryFile, (worker) => {
      this.worker = worker

      callback()
    })
  }

  private runWorker(entryFile: string, callback: (arg0: ChildProcess) => void): void {
    const worker = fork(entryFile, [], {
      silent: true,
    })

    if (this.options.stdout) {
      worker.stdout?.pipe(this.options.stdout, { end: false })
    }

    if (this.options.stderr) {
      worker.stderr?.pipe(this.options.stderr, { end: false })
    }

    setTimeout(() => callback(worker), 0)
  }
}
