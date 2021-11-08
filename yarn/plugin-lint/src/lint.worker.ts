import { isMainThread } from 'node:worker_threads'
import { parentPort }   from 'node:worker_threads'
import { workerData }   from 'node:worker_threads'
import { Worker }       from 'node:worker_threads'
import { SHARE_ENV }    from 'node:worker_threads'
import { EOL }          from 'node:os'

export const lint = (cwd: string, files: Array<string>): Promise<Array<string>> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      `
        const { parentPort } = require('node:worker_threads')
        const { workerData } = require('node:worker_threads')
        
        require(process.cwd() + '/.pnp.cjs').setup()
        ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}
        
        const { Linter } = require('@monstrs/yarn-runtime')
        
        const linter = new Linter(workerData.cwd)
        
        linter.lint(workerData.files)
            .then(results => {
                linter.loadFormatter().then(formatter => {
                    parentPort.postMessage(formatter.format(results).split('\\n'))
                })
            })
        `,
      {
        eval: true,
        workerData: {
          cwd,
          files,
        },
      }
    )
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`))
    })
  })
}
