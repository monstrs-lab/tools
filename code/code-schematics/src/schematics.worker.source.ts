import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { SchematicsRunner } from './schematics.runner'

const { type, cwd, force, dryRun, schematicName, migrationVersion, options = {} } = workerData

const runner = new SchematicsRunner(cwd, force, dryRun)

// eslint-disable-next-line no-async-promise-executor
const execution = new Promise(async (resolve, reject) => {
  try {
    if (type === 'generate') {
        await runner.init(schematicName, options)
    }

    if (type === 'migrate') {
        await runner.migrate(schematicName, migrationVersion, options)
    }
  } catch (error) {
    reject(error)
  }

  resolve(null)
})

execution.then(() => parentPort!.postMessage(''))
