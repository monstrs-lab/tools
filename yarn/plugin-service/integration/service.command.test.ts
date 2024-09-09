import assert      from 'node:assert/strict'
import { test }    from 'node:test'

import { TestEnv } from '@monstrs/yarn-test-utils'

const content = `
import { createServer } from 'node:http'

const port = 3000

createServer((req, res) => {
  res.writeHead(200)
  res.end('Hello World!')
}).listen(port)
`

test('should run yarn build command withouth errors', async () => {
  const testEnv = await TestEnv.create()

  await testEnv.run('install')
  await testEnv.mkdir('src')
  await testEnv.writeFile('src/index.ts', content)

  const { code } = await testEnv.run('service', 'build')

  assert.equal(code, 0)
  assert.ok((await testEnv.readFile('dist/index.js')).includes(`res.end('Hello World!');`))
})
