import assert            from 'node:assert/strict'
import { readFile }      from 'node:fs/promises'
import { rmdir }         from 'node:fs/promises'
import { join }          from 'node:path'
import { test }          from 'node:test'
import { after }         from 'node:test'
import { fileURLToPath } from 'node:url'

import { Icons }         from '../src/index.js'

after(async () => {
  await rmdir(join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple/src'), {
    recursive: true,
  })
})

test('should generate icons', async () => {
  const icons = await Icons.initialize(
    join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple')
  )

  await icons.generate()

  assert.equal(
    await readFile(
      join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures/simple/src/alarm.icon.tsx'),
      'utf8'
    ),
    `import React from 'react';
import { vars } from '@fixtures/icons-theme';
export const AlarmIcon = ({
  $color,
  ...props
}) => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fillRule="evenodd" clipRule="evenodd" d="M10.0511 4.875C10.9171 3.375 13.0821 3.375 13.9482 4.875L20.0104 15.375C20.8764 16.875 19.7938 18.75 18.0618 18.75H5.93744C4.20539 18.75 3.12286 16.875 3.98888 15.375L10.0511 4.875ZM12.6491 5.625C12.3605 5.125 11.6388 5.125 11.3501 5.625L5.28792 16.125C4.99925 16.625 5.36009 17.25 5.93744 17.25H18.0618C18.6391 17.25 19 16.625 18.7113 16.125L12.6491 5.625ZM11.9995 7.75C12.4137 7.75 12.7495 8.08579 12.7495 8.5V12.5C12.7495 12.9142 12.4137 13.25 11.9995 13.25C11.5853 13.25 11.2495 12.9142 11.2495 12.5V8.5C11.2495 8.08579 11.5853 7.75 11.9995 7.75ZM12.9995 15.25C12.9995 14.6977 12.5518 14.25 11.9995 14.25C11.4472 14.25 10.9995 14.6977 10.9995 15.25V15.26C10.9995 15.8123 11.4472 16.26 11.9995 16.26C12.5518 16.26 12.9995 15.8123 12.9995 15.26V15.25Z" fill={vars.colors[$color] || $color || '#f2f2f2'} /></svg>;`
  )
})
