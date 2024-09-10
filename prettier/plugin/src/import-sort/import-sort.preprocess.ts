import type { Parser }                from 'prettier'
import type { ParserOptions }                 from 'prettier'

import { sortImports }                from 'import-sort'

import { ImportSortTypeScriptParser } from './import-sort-typescript.parser.js'
import { style }                      from './import-sort.style.js'

const findTypeScriptParser = (plugins: ParserOptions['plugins']): Parser<unknown> => {
  const plugin = plugins.find((p) => {
    if (typeof p === 'string') {
      return false
    }

    if (!p.parsers) {
      return false
    }

    return p.parsers.typescript
  })

  // @ts-expect-error: Skip string matching
  return plugin!.parsers!.typescript // eslint-disable-line @typescript-eslint/no-non-null-assertion,  @typescript-eslint/no-unsafe-return
}

export const preprocess = (source: string, { plugins }: ParserOptions): string => {
  const typescript = findTypeScriptParser(plugins)

  // @ts-expect-error: Invalid arguments
  const parser = new ImportSortTypeScriptParser(typescript.parse(source))

  const { code } = sortImports(source, parser, style)

  return code
}
