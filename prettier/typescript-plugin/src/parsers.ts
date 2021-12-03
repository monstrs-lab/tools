import sortImports                      from 'import-sort'
import { parsers as typescriptParsers } from 'prettier/parser-typescript'

import { ImportSortParser }             from './import-sort'
import { style }                        from './import-sort'

const preprocess = (source, { plugins }) => {
  const plugin = plugins.find((p) => p.parsers?.typescript)

  const { code } = sortImports(
    source,
    new ImportSortParser(plugin.parsers.typescript.parse(source)),
    style
  )

  return code
}

const parse = (source, _, { plugins }) => {
  const plugin = plugins.find((p) => p.parsers?.typescript)

  const program = plugin.parsers.typescript.parse(source)

  const bodyLength = program.body.length

  const nodes = [...program.body].reverse()

  nodes.forEach((node, nodeIndex) => {
    if (node.type === 'ImportDeclaration') {
      if (node.specifiers.length > 1) {
        const index = bodyLength - nodeIndex - 1

        program.body.splice(index, 1)

        node.specifiers.forEach((specifier, specifierIndex) => {
          program.body.splice(index + specifierIndex, 0, {
            ...node,
            specifiers: node.specifiers.filter((_, i) => specifierIndex === i),
          })
        })
      }
    }
  })

  return program
}

export const parsers = {
  typescript: {
    ...typescriptParsers.typescript,
    astFormat: 'typescript-custom',
    preprocess,
    parse,
  },
}
