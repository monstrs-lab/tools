import { brotliDecompressSync } from 'node:zlib'

let hook: string | undefined

export const getContent = (): string => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(
      Buffer.from(
        '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',
        'base64'
      )
    ).toString()

  return hook
}
