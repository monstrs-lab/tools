import { brotliDecompressSync } from 'node:zlib';

let hook: string | undefined;

export const getContent = (): string => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(Buffer.from('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', 'base64')).toString();

  return hook;
};
