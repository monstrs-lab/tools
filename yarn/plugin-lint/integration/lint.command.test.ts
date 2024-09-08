import assert         from 'node:assert/strict'
import { beforeEach } from 'node:test'
import { test }       from 'node:test'

import { TestEnv }    from '@monstrs/yarn-test-utils'

let testEnv: TestEnv

beforeEach(async () => {
  testEnv = await TestEnv.create()

  await testEnv.run('install')
})

test('should run yarn lint command withouth errors', async () => {
  await testEnv.writeFile('success.ts', 'const n = (v: number): number => v; n(5);')
  await testEnv.writeFile('tsconfig.json', '{"include": ["success.ts"]}')

  const { code } = await testEnv.run('lint')

  assert.equal(code, 0)
})

test('should run yarn lint command with errors', async () => {
  await testEnv.writeFile('invalid.ts', 'const n = 5')
  await testEnv.writeFile('tsconfig.json', '{"include": ["invalid.ts"]}')

  const { code, stdout } = await testEnv.run('lint')

  assert.equal(code, 1)
  assert.ok(stdout.includes("'n' is assigned a value but never used."))
  assert.ok(stdout.includes('@typescript-eslint/no-unused-vars'))
  assert.ok(stdout.includes('> 1 | const n = 5'))
  assert.ok(stdout.includes('invalid.ts:1:7'))
})
