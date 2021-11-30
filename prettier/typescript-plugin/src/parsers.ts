import { parsers as typescriptParsers } from 'prettier/parser-typescript'

import { parser as sort }               from './import-sort'
import { parser as split }              from './import-split-specifiers'

export const parsers = {
  typescript: {
    ...typescriptParsers.typescript,
    astFormat: 'typescript-monstrs',
    ...split,
    ...sort,
  },
}
