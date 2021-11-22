import { readFile }               from 'node:fs/promises'
import { writeFile }              from 'node:fs/promises'
import { relative }               from 'node:path'
import { Worker }                 from 'node:worker_threads'

import globby                     from 'globby'
import ignore                     from 'ignore'
import { format }                 from 'prettier'

import { ignore as ignoreConfig } from './config'
import { createPatterns }         from './config'
import { config }                 from './config'

export const worker = (files: Array<string>, config): Promise<void> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(
      `
        const { parentPort } = require('node:worker_threads')
        const { workerData } = require('node:worker_threads')
        const { writeFile } = require('node:fs/promises')
        const { readFile } = require('node:fs/promises')
        
        require(process.cwd() + '/.pnp.cjs').setup()
        ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}

        const { format } = require('prettier')

        const { files, config } = workerData

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
          config,
        },
      }
    )

    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })
  })

export class Formatter {
  constructor(private readonly cwd: string) {}

  async format(files?: Array<string>) {
    if (files && files.length > 0) {
      await this.formatFiles(files)
    } else {
      await this.formatProject()
    }
  }

  async formatFiles(files: Array<string> = []) {
    const ignorer = ignore().add(ignoreConfig)

    const totalFiles = files.filter(
      (filePath) => ignorer.filter([relative(this.cwd, filePath)]).length !== 0
    )

    await worker(totalFiles, config)
    /*
    const formatPromises = totalFiles.map(async (filename: string) => {
      const input = await readFile(filename, 'utf8')

      const output = format(input, { ...config, filepath: filename })

      const isDifferent = output !== input

      if (isDifferent) {
        await writeFile(filename, output, 'utf8')
      }
    })

    await Promise.all(formatPromises)
*/
  }

  async formatProject() {
    const files = await globby(createPatterns(this.cwd), { dot: true, onlyFiles: true })

    await this.formatFiles(files)
  }
}
