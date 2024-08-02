import assert         from 'node:assert/strict'
import { beforeEach } from 'node:test'
import { test }       from 'node:test'

import { TestEnv }    from '@monstrs/yarn-test-utils'

let testEnv: TestEnv

beforeEach(async () => {
  testEnv = await TestEnv.create()

  await testEnv.run('install')
})

test('should split imports', async () => {
  await testEnv.writeFile('format.ts', 'import { a, b } from "./c"\nimport { d } from "./e"')

  await testEnv.run('format')
  await testEnv.run('format')

  assert.equal(
    await testEnv.readFile('format.ts'),
    `import { a } from './c'\nimport { b } from './c'\nimport { d } from './e'\n`
  )
})

test('should order imports', async () => {
  await testEnv.writeFile(
    'format.ts',
    'import { a } from "./c"\nimport { b } from "@scope/name"\nimport type { c } from "./d"'
  )

  await testEnv.run('format')
  await testEnv.run('format')

  assert.equal(
    await testEnv.readFile('format.ts'),
    `import type { c } from './d'\n\nimport { b }      from '@scope/name'\n\nimport { a }      from './c'\n`
  )
})

test('should align imports', async () => {
  await testEnv.writeFile(
    'format.ts',
    'import { first } from "./a"\nimport { second } from "./a"\nimport type { type } from "./a"\nimport third from "./a"'
  )

  await testEnv.run('format')
  await testEnv.run('format')

  assert.equal(
    await testEnv.readFile('format.ts'),
    `import type { type } from './a'\n\nimport { first }     from './a'\nimport { second }    from './a'\nimport third         from './a'\n`
  )
})
