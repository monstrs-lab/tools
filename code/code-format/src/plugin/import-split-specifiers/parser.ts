import { parsers as typescriptParsers } from 'prettier/parser-typescript'

export const parse = (...args) => {
  const result = typescriptParsers.typescript.parse(...args)

  const bodyLength = result.body.length

  const nodes = [...result.body].reverse()

  nodes.forEach((node, nodeIndex) => {
    if (node.type === 'ImportDeclaration') {
      if (node.specifiers.length > 1) {
        const index = bodyLength - nodeIndex - 1

        result.body.splice(index, 1)

        node.specifiers.forEach((specifier, specifierIndex) => {
          result.body.splice(index + specifierIndex, 0, {
            ...node,
            specifiers: node.specifiers.filter((_, i) => specifierIndex === i),
          })
        })
      }
    }
  })

  return result
}
