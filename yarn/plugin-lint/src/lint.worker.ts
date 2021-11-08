import { Worker } from 'node:worker_threads'

export const lint = (cwd: string, files: Array<string>): Promise<Array<string>> =>
  new Promise((resolve, reject) => {
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
                    parentPort.postMessage(formatter.format(results).split('\\n').filter(Boolean))
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
