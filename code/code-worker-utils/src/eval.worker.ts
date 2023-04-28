import { writeFile } from 'node:fs/promises'
import { access }    from 'node:fs/promises'
import { mkdir }     from 'node:fs/promises'
import { join }      from 'node:path'
import { dirname }   from 'node:path'
import { Worker }    from 'node:worker_threads'

import hash          from 'hash-string'

export class EvalWorker {
  private static async build(content: string, workerData: object): Promise<Worker> {
    const filename = hash(content)
    const file = join(process.cwd(), `.yarn/dist/${filename}.mjs`)

    try {
      try {
        await access(dirname(file))
      } catch {
        await mkdir(dirname(file), { recursive: true })
      }

      await access(file)
    } catch {
      await writeFile(file, content)
    }

    const execArgv: Array<string> = []

    try {
      await access(join(process.cwd(), '.pnp.cjs'))

      execArgv.push('--require')
      execArgv.push(join(process.cwd(), '.pnp.cjs'))
    } catch {} // eslint-disable-line no-empty

    try {
      await access(join(process.cwd(), '.pnp.cjs'))

      execArgv.push('--loader')
      execArgv.push(join(process.cwd(), '.pnp.loader.mjs'))
    } catch {} // eslint-disable-line no-empty

    return new Worker(file, {
      execArgv: [...execArgv, ...process.execArgv],
      workerData,
      env: process.env,
      stdin: true,
    })
  }

  static async run<T>(content: string, workerData: object): Promise<T> {
    const worker = await EvalWorker.build(content, workerData)

    return new Promise((resolve, reject) => {
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

  static async watch<T>(
    content: string,
    workerData: object,
    callback: (logRecord: T) => void
  ): Promise<void> {
    const worker = await EvalWorker.build(content, workerData)

    return new Promise((resolve, reject) => {
      const stdinHandler = (data) => {
        if (worker.stdin) {
          worker.stdin.write(data)
        }
      }

      const exitHandler = (code: number) => {
        process.stdin.off('data', stdinHandler)

        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`))
        } else {
          resolve()
        }
      }

      process.stdin.on('data', stdinHandler)

      worker.on('message', callback)

      worker.once('error', reject)
      worker.once('exit', exitHandler)
    })
  }
}
