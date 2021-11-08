import { Worker } from 'node:worker_threads'

export const typecheck = (cwd: string, files: Array<string>): Promise<Array<string>> =>
  new Promise((resolve, reject) => {
    const worker = new Worker(
      `
        const { parentPort } = require('node:worker_threads')
        const { workerData } = require('node:worker_threads')

        require(process.cwd() + '/.pnp.cjs').setup()
        ${process.env.TOOLS_DEV_MODE ? `require('@monstrs/tools-setup-ts-execution')` : ''}
        
        const { TypeScript } = require('@monstrs/yarn-runtime')
        
        const ts = new TypeScript(workerData.cwd)
        
        const diagnostics = ts.check(workerData.files)
       
        const outputs = diagnostics.map((diagnostic) => ts.formatDiagnostic(diagnostic).split('\\n')).flat()

        parentPort.postMessage(outputs)`,
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
