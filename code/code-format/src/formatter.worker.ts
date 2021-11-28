import { Worker } from 'node:worker_threads'

export class FormatterWorker {
  static async run(files: Array<string>) {
    return new Promise((resolve, reject) => {
      const worker = FormatterWorker.create(files)

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

  static create(files: Array<string>) {
    const { prettier } = require('@monstrs/code-runtime')
    const { prettierConfig } = require('@monstrs/code-runtime')

    return new Worker(
      `
        const { parentPort } = require('node:worker_threads')
        const { workerData } = require('node:worker_threads')
        const { writeFile } = require('node:fs/promises')
        const { readFile } = require('node:fs/promises')
        
        require(process.cwd() + '/.pnp.cjs').setup()
        ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}

        const { format } = require('${prettier}')
        const config = require('${prettierConfig}')

        const { files } = workerData

        Promise.all(files.map(async (filename) => {
        const input = await readFile(filename, 'utf8')

        const output = format(input, { ...config, filepath: filename })

        if (output !== input) {
            await writeFile(filename, output, 'utf8')
        }
        })).then(() => parentPort.postMessage(''))
        `,
      {
        eval: true,
        workerData: {
          files,
        },
      }
    )
  }
}
