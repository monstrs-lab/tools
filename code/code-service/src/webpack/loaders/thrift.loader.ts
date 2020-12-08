import fileLoader from 'file-loader'
import path       from 'path'

export const getThriftFileName = (resourcePath) => {
  const hash = Buffer.from(path.dirname(resourcePath)).toString('hex')

  return `./${hash.substr(hash.length - 20)}-${path.basename(resourcePath)}`
}

// eslint-disable-next-line func-names
export default function (source) {
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

  return result
}
