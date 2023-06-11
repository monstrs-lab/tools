/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Printer }   from 'prettier'
import type { AST }       from 'prettier'

import { extractPrinter } from './patch.js'

const printer = await extractPrinter()

const nodeImportSize = (node): number => {
  if (node.specifiers.length === 0) {
    return 0
  }

  const specifier = node.specifiers[node.specifiers.length - 1]

  const offset = specifier.imported ? 8 : 6

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return specifier.loc.end.column + offset
}

export const print: Printer['print'] = (path, options, prnt): any => {
  const node = path.getNode()

  const plugin: any = options.plugins.find((p: any) => p?.printers?.estree)

  let result = plugin.printers.estree.print(path, options, prnt)

  if (node.type === 'ImportDeclaration') {
    result = result.map((part) => {
      if (Array.isArray(part) && part[0] === ' from' && node.alignOffset > 0) {
        const fill = Array.apply(0, Array(node.alignOffset)).fill(' ').join('')

        part[0] = `${fill} from` // eslint-disable-line no-param-reassign
      }

      return part
    })
  }

  return result
}

export const preprocess = async (ast: AST): Promise<AST> => {
  const imports = ast.body.filter(
    (node) =>
      node.type === 'ImportDeclaration' && node.loc && node.loc.end.line === node.loc.start.line
  )

  const maxAlignLength =
    imports.length > 0 ? Math.max(...imports.map((node) => nodeImportSize(node))) : 0

  ast.body.forEach((node, index) => {
    if (
      node.type === 'ImportDeclaration' &&
      node.loc &&
      node.loc.end.line === node.loc.start.line
    ) {
      node.alignOffset = 0 // eslint-disable-line

      const nodeLength = nodeImportSize(node)

      // eslint-disable-next-line
      node.alignOffset = nodeLength < maxAlignLength ? maxAlignLength - nodeLength : 0
    }
  })

  return ast
}

export const printers: Record<string, Printer> = {
  'typescript-custom': {
    ...printer,
    preprocess,
    print,
  },
}
