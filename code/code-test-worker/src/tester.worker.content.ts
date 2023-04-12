import { brotliDecompressSync } from 'zlib';

let hook;

export const getContent = () => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(Buffer.from('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', 'base64')).toString();

  return hook;
};
