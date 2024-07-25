/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Parser }                        from 'prettier'
import type { ParserOptions }                 from 'prettier'
import type { Plugin }                        from 'prettier'

import * as babel                             from 'prettier/plugins/babel'
import * as typescript                        from 'prettier/plugins/typescript'
import sortPackageJson                        from 'sort-package-json'

import { preprocess as importSortPreprocess } from './import-sort/index.js'

const preprocess = (source: string, options: ParserOptions): string =>
  importSortPreprocess(source, options)

const parse = async (source: string, options: ParserOptions): Promise<any> => {
  const plugin = options.plugins.find((p) => (p as Plugin).parsers?.typescript) as Plugin

  const program = plugin.parsers!.typescript.parse(source, options)
  const bodyLength = program.body.length

  const nodes = [...program.body].reverse()

  nodes.forEach((node, nodeIndex: number) => {
    if (node.type === 'ImportDeclaration') {
      if (node.specifiers.length > 1) {
        const index = bodyLength - nodeIndex - 1

        program.body.splice(index, 1)

        node.specifiers.forEach((_: unknown, specifierIndex: number) => {
          program.body.splice(index + specifierIndex, 0, {
            ...node,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            specifiers: node.specifiers.filter((_: unknown, i: number) => specifierIndex === i),
          })
        })
      }
    }
  })

  return program // eslint-disable-line @typescript-eslint/no-unsafe-return
}

export const parsers: Record<string, Parser> = {
  typescript: {
    ...typescript.parsers.typescript,
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
