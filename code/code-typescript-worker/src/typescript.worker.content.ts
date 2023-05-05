import { brotliDecompressSync } from 'node:zlib'

let hook

export const getContent = () => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(
      Buffer.from(
        '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',
        'base64'
      )
    ).toString()

  return hook
}
