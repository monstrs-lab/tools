import { exit }        from 'node:process'
import { setTimeout }  from 'node:timers/promises'
import { parentPort }  from 'node:worker_threads'
import { workerData }  from 'node:worker_threads'

import { serialize }   from '@ungap/structured-clone'
import { deserialize } from '@ungap/structured-clone'

import { Tester }      from '@monstrs/code-test'

const {
  type,
  cwd,
  options,
  files = [],
}: { type: 'integration' | 'unit'; cwd: string; options: object; files: Array<string> } = workerData

const execute = async (): Promise<void> => {
  const results =
    type === 'unit'
      ? await new Tester(cwd).unit(options, files)
      : await new Tester(cwd).integration(options, files)

  try {
    parentPort!.postMessage(results)
  } catch {
    parentPort!.postMessage(deserialize(serialize(results)))
  }
}

await execute()
await setTimeout(180)

exit(0)
