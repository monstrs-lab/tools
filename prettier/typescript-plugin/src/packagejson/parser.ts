import { parsers as babelParsers } from 'prettier/parser-babel'
import sortPackageJson from 'sort-package-json'
import parser  from 'json-stringify'

export const parser = {
    ...(babelParsers['json-stringify']),
    preprocess(text, options) {
      if (parser.preprocess) {
        text = parser.preprocess(text, options)
      }

      return options.filepath && /(^|\\|\/)package\.json$/.test(options.filepath)
        ? sortPackageJson(text)
        : text
    },
}
