/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Node }              from '@babel/types'
import type { Comment }           from '@babel/types'
import type { ImportDeclaration } from '@babel/types'
import type { IImport }           from 'import-sort-parser'
import type { IParser }           from 'import-sort-parser'
import type { NamedMember }       from 'import-sort-parser'
import type { AST }               from 'prettier'

export class ImportSortTypeScriptParser implements IParser {
  constructor(private readonly program: AST) {}

  parseImports(_: string): Array<IImport> {
    const imports: Array<IImport> = this.program.body
      .filter((node: Node) => node.type === 'ImportDeclaration')
      .map((node: ImportDeclaration) => {
        const imp: IImport = {
          start: node.range![0],
          end: node.range![1],

          importStart: node.range![0],
          importEnd: node.range![1],

          type: node.importKind === 'type' ? 'import-type' : 'import',

          moduleName: node.source.value,

          defaultMember: node.specifiers.find(
            (specifier) => specifier.type === 'ImportDefaultSpecifier'
          )?.local?.name,

          namespaceMember: node.specifiers.find(
            (specifier) => specifier.type === 'ImportNamespaceSpecifier'
          )?.local?.name,

          namedMembers: node.specifiers
            .filter((specifier) => specifier.type === 'ImportSpecifier')
            .map((specifier) => ({
              // @ts-expect-error
              name: specifier.imported.name,
              alias: specifier.local.name,
              type: node.importKind === 'type',
            })),
        }

        const lineComment = this.program.comments.find(
          (comment: Comment) =>
            comment.loc!.start.line === node.loc!.start.line &&
            comment.loc!.end.line === node.loc!.end.line
        )

        if (lineComment) {
          // eslint-disable-next-line prefer-destructuring
          imp.end = lineComment.range[1]
        }

        const findLeadingComments = (position: number): typeof this.program.comments => {
          const leadingComment = this.program.comments.find(
            (comment: Comment) => comment.loc!.start.line === position
          )

          if (!leadingComment) {
            return []
          }

          const parents = findLeadingComments(leadingComment.loc.start.line - 1)

          return [...parents, leadingComment]
        }

        const leadingComments: Array<any> = findLeadingComments(node.loc!.start.line - 1)

        if (leadingComments.length > 0) {
          imp.start = leadingComments.at(0).range.at(0)
        }

        return imp
      })

    return imports
  }

  formatImport(code: string, imported: IImport, eol = '\n'): string {
    const importStart = imported.importStart || imported.start
    const importEnd = imported.importEnd || imported.end

    const importCode = code.substring(importStart, importEnd)

    const { namedMembers } = imported

    if (namedMembers.length === 0) {
      return code.substring(imported.start, imported.end)
    }

    const newImportCode = importCode.replace(/\{[\s\S]*\}/g, (namedMembersString) => {
      const useMultipleLines = namedMembersString.includes(eol)

      let prefix: string | undefined

      if (useMultipleLines) {
        ;[prefix] = namedMembersString.split(eol)[1].match(/^\s*/)!
      }

      const useSpaces = namedMembersString.charAt(1) === ' '

      const userTrailingComma = namedMembersString.replace('}', '').trim().endsWith(',')

      return this.formatNamedMembers(
        namedMembers,
        useMultipleLines,
        useSpaces,
        userTrailingComma,
        prefix,
        eol
      )
    })

    return (
      code.substring(imported.start, importStart) +
      newImportCode +
      code.substring(importEnd, importEnd + (imported.end - importEnd))
    )
  }

  formatNamedMembers(
    namedMembers: Array<NamedMember>,
    useMultipleLines: boolean,
    useSpaces: boolean,
    useTrailingComma: boolean,
    prefix: string = '',
    eol = '\n'
  ): string {
    /* eslint-disable prefer-template */

    if (useMultipleLines) {
      return (
        '{' +
        eol +
        namedMembers
          .map(({ name, alias }: { name: string; alias: string }, index) => {
            const lastImport: boolean = index === namedMembers.length - 1
            const comma: string = !useTrailingComma && lastImport ? '' : ','

            if (name === alias) {
              return `${prefix}${name}${comma}` + eol
            }

            return `${prefix}${name} as ${alias}${comma}` + eol
          })
          .join('') +
        '}'
      )
    }

    const space = useSpaces ? ' ' : ''
    const comma = useTrailingComma ? ',' : ''

    return (
      '{' +
      space +
      namedMembers
        .map(({ name, alias }) => {
          if (name === alias) {
            return `${name}`
          }

          return `${name} as ${alias}`
        })
        .join(', ') +
      comma +
      space +
      '}'
    )
    /* eslint-enable prefer-template */
  }
}
