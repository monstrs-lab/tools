import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import serialize      from 'safe-stable-stringify'

import { Tester }     from '@monstrs/code-test'

const { type, cwd, options, files = [] } = workerData

const tester = new Tester(cwd)

const tests = type === 'unit' ? tester.unit(options, files) : tester.integration(options, files)

tests
  .then((results) => parentPort!.postMessage(JSON.parse(serialize(results))))
  .then(() => {
    setTimeout(() => {
      process.exit(0)
    }, 100)
  })
