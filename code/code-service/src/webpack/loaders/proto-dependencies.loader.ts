import fileLoader from 'file-loader'
import path from 'path'
import { parse } from 'protocol-buffers-schema'

export const getProtoFileName = (resourcePath) => {
  const hash = Buffer.from(path.dirname(resourcePath)).toString('hex')

  return `./${hash.substr(hash.length - 20)}-${path.basename(resourcePath)}`
}

// eslint-disable-next-line func-names
export default function (source) {
  const { imports } = parse(source)

  const dependencies: Array<string> = []

  imports.forEach((importPath) => {
    if (!path.isAbsolute(importPath)) {
      const importAbsolutePath = path.join(path.dirname(this.resourcePath), importPath)
      const targetPath = getProtoFileName(importAbsolutePath)

      // eslint-disable-next-line no-param-reassign
      source = source.replace(importPath, targetPath)

      dependencies.push(`require('${importAbsolutePath}')`)

      this.addDependency(importAbsolutePath)
    }
  })

  const result = fileLoader.call(
    {
      ...this,
      query: {
        postTransformPublicPath: (p) => `__non_webpack_require__.resolve(${p})`,
        name: getProtoFileName(this.resourcePath),
      },
    },
    source
  )

  return [...dependencies, result].join('\n')
}
