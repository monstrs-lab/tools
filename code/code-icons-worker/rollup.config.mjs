/* eslint-disable @typescript-eslint/explicit-function-return-type */

import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import { brotliCompressSync } from 'node:zlib'

const wrapOutput = () => ({
  name: 'wrap-output',
  generateBundle(options, bundle, isWrite) {
    const bundles = Object.keys(bundle)
    if (bundles.length !== 1) throw new Error(`Expected only one bundle, got ${bundles.length}`)

    const outputBundle = bundle[bundles[0]]

    outputBundle.code = `import { brotliDecompressSync } from 'node:zlib';\n\nlet hook;\n\nexport const getContent = (): string => {\n  if (typeof hook === \`undefined\`)\n    hook = brotliDecompressSync(Buffer.from('${brotliCompressSync(
      outputBundle.code.replace(/\r\n/g, '\n')
    ).toString('base64')}', 'base64')).toString();\n\n  return hook;\n};\n`
  },
})

export default [
  {
    external(id) {
      if (['pnpapi', 'typescript', '@monstrs/tools-runtime'].includes(id)) {
        return true
      }

      if (id.includes('/code-runtime/')) {
        return true
      }

      return false
    },
    input: './src/icons.worker.source.ts',
    output: {
      file: './src/icons.worker.content.ts',
      format: 'esm',
      generatedCode: 'es2015',
    },
    plugins: [
      resolve({
        extensions: ['.mjs', '.js', '.ts', '.tsx', '.json'],
        rootDir: join(fileURLToPath(new URL('.', import.meta.url)), '../../'),
        jail: join(fileURLToPath(new URL('.', import.meta.url)), '../../'),
        preferBuiltins: true,
      }),
      esbuild({ tsconfig: false, target: 'node20' }),
      cjs({ transformMixedEsModules: true, extensions: ['.js', '.ts'] }),
      json(),
      wrapOutput(),
    ],
  },
]
