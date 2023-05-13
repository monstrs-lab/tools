import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { Linter }     from '@monstrs/code-lint'

new Linter(workerData.cwd)
  .lint(workerData.files, workerData.options)
  .then((results) => parentPort!.postMessage(results))
