let hook

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib')
      .brotliDecompressSync(
        Buffer.from(
          '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',
          'base64'
        )
      )
      .toString()

  return hook
}
