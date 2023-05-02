import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import serialize      from 'safe-stable-stringify'

import { TypeScript } from '@monstrs/code-typescript'

const { type, cwd, include, override } = workerData

const ts = new TypeScript(cwd)

if (type === 'check') {
  ts.check(include).then((diagnostics) =>
    parentPort!.postMessage(JSON.parse(serialize(diagnostics))))
} else {
  ts.build(include, override).then((diagnostics) =>
    parentPort!.postMessage(JSON.parse(serialize(diagnostics))))
}
