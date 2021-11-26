import { Worker }          from 'node:worker_threads'

import type { Diagnostic } from 'typescript'

export class TypeScriptWorker {
  static async run(cwd: string, config, noEmit: boolean): Promise<Array<Diagnostic>> {
    return new Promise((resolve, reject) => {
      const worker = TypeScriptWorker.create(cwd, config, noEmit)

      const exitHandler = (code: number) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
      }

      worker.once('message', (result) => {
        worker.off('error', reject)
        worker.off('exit', exitHandler)
        resolve(result)
      })

      worker.once('error', reject)
      worker.once('exit', exitHandler)
    })
  }

  static create(cwd: string, config, noEmit: boolean) {
    return new Worker(
      `
              const { parentPort } = require('node:worker_threads')
              const { workerData } = require('node:worker_threads')
              const { writeFile } = require('node:fs/promises')
              const { readFile } = require('node:fs/promises')
              
              try {
                require(process.cwd() + '/.pnp.cjs').setup()
                ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}
              } catch {}
      
              const { typescript } = require('@monstrs/code-runtime')

              const ts = require(typescript)
      
              const { config, cwd, noEmit } = workerData
      
              const { fileNames, options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, cwd)
      
              if (errors?.length > 0) {
                parentPort.postMessage(errors)
              } else {
                const program = ts.createProgram(fileNames, {
                  ...options,
                  noEmit,
                })
        
                const result = program.emit()
        
                parentPort.postMessage(ts.getPreEmitDiagnostics(program).concat(result.diagnostics))
              }
              `,
      {
        eval: true,
        workerData: {
          cwd,
          config,
          noEmit,
        },
      }
    )
  }
}
