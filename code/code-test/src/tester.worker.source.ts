import { runCLI }      from '@jest/core'

import { accessSync }  from 'fs'
import { join }        from 'path'
import { parentPort }  from 'worker_threads'
import { workerData }  from 'worker_threads'

import { integration } from '@monstrs/config-jest'
import { unit }        from '@monstrs/config-jest'

process.env.TS_JEST_DISABLE_VER_CHECKER = 'true'

const isFileExists = (file) => {
  try {
    accessSync(file)

    return true
  } catch {
    return false
  }
}

const { type, cwd, options, files = [] } = workerData

const setup = {
  globalSetup: isFileExists(join(cwd, `.config/test/${type}/setup.ts`))
    ? join(cwd, `.config/test/${type}/setup.ts`)
    : undefined,
  globalTeardown: isFileExists(join(cwd, `.config/test/${type}/teardown.ts`))
    ? join(cwd, `.config/test/${type}/teardown.ts`)
    : undefined,
}

const argv = {
  rootDir: cwd,
  ci: false,
  detectLeaks: false,
  detectOpenHandles: false,
  errorOnDeprecated: false,
  listTests: false,
  passWithNoTests: true,
  runTestsByPath: false,
  testLocationInResults: true,
  config: JSON.stringify({ ...(type === 'integration' ? integration : unit), ...setup }),
  maxConcurrency: 5,
  notifyMode: 'failure-change',
  _: files,
  ...options,
}

runCLI(argv, [cwd]).then(({ results }) => parentPort!.postMessage(results))
