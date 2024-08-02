import assert           from 'node:assert/strict'
import { test }         from 'node:test'

import { CommitLinter } from './commit.linter.js'

test('code-commit lint', async () => {
  const { valid } = await new CommitLinter().lint('feat(common): init')

  assert.equal(valid, true)
})
