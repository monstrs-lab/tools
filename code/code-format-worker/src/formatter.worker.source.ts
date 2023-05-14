import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { Formatter }  from '@monstrs/code-format'

await new Formatter(workerData.cwd).format(workerData.files)

parentPort!.postMessage('')
