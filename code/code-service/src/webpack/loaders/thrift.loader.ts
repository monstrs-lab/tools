import { parse }      from '@creditkarma/thrift-parser'
import { SyntaxType } from '@creditkarma/thrift-parser'
import fileLoader     from 'file-loader'
import path           from 'path'

export const getThriftFileName = (resourcePath) => {
  return `./${path.basename(resourcePath)}`
}

// eslint-disable-next-line func-names
export default function (source) {
  const thriftAst = parse(source)

  const dependencies: Array<string> = []

  if (thriftAst.type === SyntaxType.ThriftDocument) {
    thriftAst.body.forEach((ast) => {
      if (ast.type === SyntaxType.IncludeDefinition) {
        const absolutePath = path.join(path.dirname(this.resourcePath), ast.path.value)
        const targetPath = getThriftFileName(absolutePath)

        // eslint-disable-next-line no-param-reassign
        source = source.replace(ast.path.value, targetPath)

        dependencies.push(`require('${absolutePath}')`)

        this.addDependency(absolutePath)
      }
    })
  }

  const result = fileLoader.call(
    {
      ...this,
      query: {
        postTransformPublicPath: (p) => `__non_webpack_require__.resolve(${p})`,
        name: getThriftFileName(this.resourcePath),
      },
    },
    source
  )

  return [...dependencies, result].join('\n')
}
