import assert         from 'node:assert/strict'
import { beforeEach } from 'node:test'
import { test }       from 'node:test'

import { TestEnv }    from '@monstrs/yarn-test-utils'

let testEnv: TestEnv

beforeEach(async () => {
  testEnv = await TestEnv.create()

  await testEnv.run('install')
})

test('should run yarn types check command withouth errors', async () => {
  await testEnv.writeFile('success.ts', 'const s = (n: number) => n; s(5)')

  const { code } = await testEnv.run('types', 'check')

  assert.equal(code, 0)
})

test('should run yarn types check command with errors', async () => {
  await testEnv.writeFile('invalid.ts', 'const s = (n: string) => n; s(5)')

  const { stdout, code } = await testEnv.run('types', 'check')

  assert.equal(code, 1)
  assert.ok(stdout.includes("Argument of type 'number' is not assignable to parameter of type"))
  assert.ok(stdout.includes('const s = (n: string) => n; s(5)'))
  assert.ok(stdout.includes('invalid.ts:1:30'))
})
