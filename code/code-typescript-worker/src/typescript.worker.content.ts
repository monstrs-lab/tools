import { brotliDecompressSync } from 'node:zlib';

let hook: string | undefined;

export const getContent = (): string => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(Buffer.from('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', 'base64')).toString();

  return hook;
};
