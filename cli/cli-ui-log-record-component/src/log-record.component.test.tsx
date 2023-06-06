import { LOGGER_SQL_ATTRIBUTE_NAME }    from '@monstrs/mikro-orm-logger'
import { LOGGER_PARAMS_ATTRIBUTE_NAME } from '@monstrs/mikro-orm-logger'
import { describe }                     from '@jest/globals'
import { expect }                       from '@jest/globals'
import { it }                           from '@jest/globals'
import React                            from 'react'
import stripAnsi                        from 'strip-ansi'

import { renderStatic }                 from '@monstrs/cli-ui-renderer'

import { LogRecord }                    from './log-record.component.jsx'

const createStack = (): string => {
  const cwd = process.cwd()

  return `Error: test
    at Object.<anonymous> (${cwd}/mctl/mctl-ui/src/log/log-record.component.test.jsx:10:12)
    at Object.asyncJestTest (${cwd}/.yarn/cache/jest-jasmine2-npm-26.6.3-aba0c11c28-18b15901f8.zip/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:106:37)
    at ${cwd}/.yarn/cache/jest-jasmine2-npm-26.6.3-aba0c11c28-18b15901f8.zip/node_modules/jest-jasmine2/build/queueRunner.js:45:12
    at new Promise (<anonymous>)
    at mapper (${cwd}/.yarn/cache/jest-jasmine2-npm-26.6.3-aba0c11c28-18b15901f8.zip/node_modules/jest-jasmine2/build/queueRunner.js:28:19)
    at ${cwd}/.yarn/cache/jest-jasmine2-npm-26.6.3-aba0c11c28-18b15901f8.zip/node_modules/jest-jasmine2/build/queueRunner.js:75:41
    at processTicksAndRejections (internal/process/task_queues.js:93:5)`
}

describe('log record component', () => {
  it('render', () => {
    const output = renderStatic(<LogRecord namespace='test' body='message' />, 160)

    expect(stripAnsi(output)).toMatchSnapshot()
  })

  it('render body error stack', () => {
    const output = renderStatic(<LogRecord namespace='test' stack={createStack()} />, 160)

    expect(stripAnsi(output)).toMatchSnapshot()
  })

  it('render mikro orm query', () => {
    const output = renderStatic(
      <LogRecord
        namespace='test'
        body='query'
        attributes={{
          [LOGGER_SQL_ATTRIBUTE_NAME]: `select "s0".* from "test" as "s0" where "s0"."id" = 'a89794ba-7269-41e7-8075-e17bc2657942'`,
          [LOGGER_PARAMS_ATTRIBUTE_NAME]: ['a89794ba-7269-41e7-8075-e17bc2657942'],
        }}
      />,
      160
    )

    expect(stripAnsi(output)).toMatchSnapshot()
  })
})
