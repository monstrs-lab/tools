import { ChildProcess }      from 'node:child_process'
import { fork }              from 'node:child_process'
import { resolve }           from 'node:path'
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

  logger: StartServerLogger

  constructor(options: Partial<StartServerPluginOptions> = {}) {
    this.logger = new StartServerLogger(options)
    this.options = {
      entryName: 'index',
      ...options,
    }

    this.enableRestarting()
  }

  private enableRestarting(): void {
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (data: string) => {
      if (data.trim() === 'rs') {
        this.restartServer()
      }
    })
  }

  getEntryFile(compilation) {
    const { entryName } = this.options
    const { entrypoints } = compilation

    const entry = entrypoints.get ? entrypoints.get(entryName) : entrypoints[entryName!]

    if (!entry) {
      throw new Error(
        `Requested entry "${entryName}" does not exist, try one of: ${(entrypoints.keys
          ? entrypoints.keys()
          : Object.keys(entrypoints)
        ).join(' ')}`
      )
    }

    const entryScript = webpack.EntryPlugin
      ? // eslint-disable-next-line no-underscore-dangle
        entry._runtimeChunk.files.values().next().value
      : entry.chunks[0].files[0]

    if (!entryScript) {
      throw new Error(`Entry chunk not outputted: ${entry}`)
    }

    const { path } = compilation.outputOptions

    return resolve(path, entryScript)
  }

  private afterEmit = (compilation: webpack.Compilation, callback: () => void): void => {
    if (this.worker && this.worker.connected && this.worker?.pid) {
      this.restartServer()
      callback()
      return
    }

    this.startServer(compilation, callback)
  }

  apply = (compiler: webpack.Compiler): void => {
    compiler.hooks.afterEmit.tapAsync({ name: 'StartServerPlugin' }, this.afterEmit)
  }

  private restartServer(): void {
    this.logger.info('Restarting service...')

    if (this.worker?.pid) {
      process.kill(this.worker.pid)
    }

    if (this.entryFile) {
      this.runWorker(this.entryFile, (worker) => {
        this.worker = worker
      })
    }
  }

  private startServer = (compilation: webpack.Compilation, cb: () => void): void => {
    this.entryFile = this.getEntryFile(compilation)

    this.runWorker(this.entryFile, (worker) => {
      this.worker = worker
      cb()
    })
  }

  private runWorker(entryFile: string, cb: (arg0: ChildProcess) => void): void {
    const worker = fork(entryFile, [], {
      silent: true,
    })

    if (this.options.stdout) {
      worker.stdout?.pipe(this.options.stdout, { end: false })
    }

    if (this.options.stderr) {
      worker.stderr?.pipe(this.options.stderr, { end: false })
    }

    setTimeout(() => cb(worker), 0)
  }
}
