import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { Tester }     from '@monstrs/code-test'

const { type, cwd, options, files = [] } = workerData

const tester = new Tester(cwd)

if (type === 'unit') {
  tester.unit(options, files).then((results) => parentPort!.postMessage(results))
} else {
  tester.integration(options, files).then((results) => parentPort!.postMessage(results))
}
