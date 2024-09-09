import assert         from 'node:assert/strict'
import { beforeEach } from 'node:test'
import { test }       from 'node:test'

import { TestEnv }    from '@monstrs/yarn-test-utils'
import tsconfig       from '@monstrs/config-typescript'

let testEnv: TestEnv

beforeEach(async () => {
  testEnv = await TestEnv.create()

  await testEnv.run('install')
  await testEnv.mkdir('tests')
})

test('should run yarn test unit command withouth errors', async () => {
  await testEnv.writeFile(
    'tests/unit.test.ts',
    `import { test } from 'node:test'\ntest('success', (t) => { t.assert.ok(true) })`
  )
  await testEnv.writeFile(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: tsconfig.compilerOptions,
      include: ['tests/*'],
    })
  )

  const { code } = await testEnv.run('test', 'unit')

  assert.equal(code, 0)
})

test('should run yarn test unit command with errors', async () => {
  await testEnv.writeFile(
    'tests/unit.test.ts',
    `import { test } from 'node:test'\ntest('success', (t) => { t.assert.ok(false) })`
  )
  await testEnv.writeFile(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: tsconfig.compilerOptions,
      include: ['tests/*'],
    })
  )

  const { code, stderr } = await testEnv.run('test', 'unit')

  assert.equal(code, 1)
  assert.ok(stderr.includes('tests/unit.test.ts:2:1'))
  assert.ok(stderr.includes('false == true'))
  assert.ok(stderr.includes(`> 2 | test('success', (t) => { t.assert.ok(false) })`))
})

test('should test itnegration withouth errors', async () => {
  await testEnv.mkdir('tests/integration')
  await testEnv.writeFile(
    'tests/integration/integration.test.ts',
    `import { test } from 'node:test'\ntest('success', (t) => { t.assert.ok(true) })`
  )
  await testEnv.writeFile(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: tsconfig.compilerOptions,
      include: ['tests/*'],
    })
  )

  const { code } = await testEnv.run('test', 'integration')

  assert.equal(code, 0)
})

test('should test unit with errors', async () => {
  await testEnv.mkdir('tests/integration')
  await testEnv.writeFile(
    'tests/integration/integration.test.ts',
    `import { test } from 'node:test'\ntest('success', (t) => { t.assert.ok(false) })`
  )
  await testEnv.writeFile(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: tsconfig.compilerOptions,
      include: ['tests/*'],
    })
  )

  const { code, stderr } = await testEnv.run('test', 'integration')

  assert.equal(code, 1)
  assert.ok(stderr.includes('tests/integration/integration.test.ts:2:1'))
  assert.ok(stderr.includes('false == true'))
  assert.ok(stderr.includes(`> 2 | test('success', (t) => { t.assert.ok(false) })`))
})
