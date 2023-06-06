import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { Linter }     from '@monstrs/code-lint'

parentPort!.postMessage(
  await new Linter(workerData.cwd, workerData.rootCwd).lint(workerData.files, workerData.options)
)
