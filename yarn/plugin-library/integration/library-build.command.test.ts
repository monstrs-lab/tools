import assert       from 'node:assert/strict'
import { describe } from 'node:test'
import { test }     from 'node:test'

import { TestEnv }  from '@monstrs/yarn-test-utils'

describe('yarn', () => {
  describe('commands', () => {
    describe('library', () => {
      test('should build withouth errors', async () => {
        const testEnv = await TestEnv.create()

        await testEnv.run('install')

        await testEnv.mkdir('src')
        await testEnv.writeFile('src/index.ts', 'export const test = (n: number) => n * 2')

        const { code } = await testEnv.run('library', 'build')

        assert.equal(code, 0)
        assert.equal(await testEnv.readFile('dist/index.js'), 'export const test = (n) => n * 2;\n')
      })
    })
  })
})
