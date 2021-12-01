/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable global-require */

import { Worker }      from 'node:worker_threads'

import type { ESLint } from 'eslint'

export class LinterWorker {
  static async run(files: Array<string>, config): Promise<Array<ESLint.LintResult>> {
    return new Promise((resolve, reject) => {
      const worker = LinterWorker.create(files, config)

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

  static create(files: Array<string>, config) {
    const { eslint } = require('@monstrs/code-runtime')
    const { eslintConfig } = require('@monstrs/code-runtime')

    return new Worker(
      `
        const { parentPort } = require('node:worker_threads')
        const { workerData } = require('node:worker_threads')
        const { writeFile } = require('node:fs/promises')
        const { readFile } = require('node:fs/promises')
        
        require(process.cwd() + '/.pnp.cjs').setup()
        ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}

        const { ESLint } = require('${eslint}')
        const { eslintPlugins } = require('@monstrs/code-runtime')
        const baseConfig = require('${eslintConfig}').default

        const { files, config } = workerData

        const eslint = new ESLint({
          baseConfig,
          plugins: eslintPlugins
        })

        eslint.lintFiles(files)
            .then(results => {
                    parentPort.postMessage(results)
            })
        `,
      {
        eval: true,
        workerData: {
          files,
          config,
        },
      }
    )
  }
}
