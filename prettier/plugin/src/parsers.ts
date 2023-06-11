/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Parser }                from 'prettier'

import sortImportsPkg                 from 'import-sort'
import sortPackageJson                from 'sort-package-json'

import { ImportSortTypeScriptParser } from './import-sort/index.js'
import { style }                      from './import-sort/index.js'
import { babel }                      from './imports.js'
import { typescript }                 from './imports.js'

// TODO: moduleResolution
const sortImports = sortImportsPkg as any

const preprocess: Parser['preprocess'] = (source, { plugins }) => {
  const plugin: any = plugins.find((p: any) => p.parsers?.typescript)

  const { code } = sortImports(
    source,
    new ImportSortTypeScriptParser(plugin.parsers.typescript.parse(source)),
    style
  )

  return code
}

const parse: Parser['parse'] = async (source, { plugins }) => {
  const plugin: any = plugins.find((p: any) => p.parsers?.typescript)

  const program = plugin.parsers.typescript.parse(source)

  const bodyLength = program.body.length

  const nodes = [...program.body].reverse()

  nodes.forEach((node, nodeIndex) => {
    if (node.type === 'ImportDeclaration') {
      if (node.specifiers.length > 1) {
        const index = bodyLength - nodeIndex - 1

        program.body.splice(index, 1)

        node.specifiers.forEach((_, specifierIndex) => {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          program.body.splice(index + specifierIndex, 0, {
            ...node,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            specifiers: node.specifiers.filter((_, i) => specifierIndex === i),
          })
        })
      }
    }
  })

  return program
}

export const parsers: Record<string, Parser> = {
  typescript: {
    ...typescript.parsers!.typescript,
    astFormat: 'typescript-custom',
    preprocess,
    parse,
  },
  'json-stringify': {
    ...babel.parsers['json-stringify'],
    preprocess(text, options) {
      if (babel.parsers['json-stringify'].preprocess) {
        // eslint-disable-next-line no-param-reassign
        text = babel.parsers['json-stringify'].preprocess(text, options)
      }

      return options.filepath && /(^|\\|\/)package\.json$/.test(options.filepath)
        ? sortPackageJson(text)
        : text
    },
  },
}
