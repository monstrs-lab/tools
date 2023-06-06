import { parentPort } from 'node:worker_threads'
import { workerData } from 'node:worker_threads'

import { stringify }  from 'flatted'
import { parse }      from 'flatted'

import { TypeScript } from '@monstrs/code-typescript'

const { type, cwd, include, override } = workerData

const execute = async (): Promise<void> => {
  if (type === 'check') {
    parentPort!.postMessage(parse(stringify(await new TypeScript(cwd).check(include))))
  }

  if (type === 'build') {
    parentPort!.postMessage(parse(stringify(await new TypeScript(cwd).build(include, override))))
  }
}

await execute()
