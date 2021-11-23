import React                    from 'react'
import stripAnsi                from 'strip-ansi'

import { renderStatic }         from '@monstrs/cli-ui-renderer'

import { TypeScriptDiagnostic } from './typescript-diagnostic.component'

describe('eslint result component', () => {
  it('render', () => {
    const value = {
      file: {
        fileName:
          '/Users/andreylinko/workspace/lab/tools/cli/cli-ui-typescript-diagnostic-component/src/b.ts',
        text: "const n = (s: number) => s\nn('asdfasdfasd')\n",
        lineMap: [0, 27, 44],
      },
      start: 29,
      category: 1,
      messageText: "Argument of type 'string' is not assignable to parameter of type 'number'.",
    }

    const output = renderStatic(<TypeScriptDiagnostic {...value} />, 160)

    expect(stripAnsi(output)).toMatchSnapshot()
  })
})
