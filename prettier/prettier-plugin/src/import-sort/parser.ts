import * as parser from 'import-sort-parser-typescript'
import sortImports from 'import-sort'

export const preprocess = (source) => {
  const { code } = sortImports(source, parser, require.resolve('./style'))

  return code
}
