import cjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import path from 'node:path'
import json from '@rollup/plugin-json'
import esbuild from 'rollup-plugin-esbuild'
import { terser } from 'rollup-plugin-terser'
import { brotliCompressSync } from 'node:zlib'
import analyze from 'rollup-plugin-analyzer'
import externals from 'rollup-plugin-node-externals'

const wrapOutput = () => ({
  name: `wrap-output`,
  generateBundle(options, bundle, isWrite) {
    const bundles = Object.keys(bundle)
    if (bundles.length !== 1) throw new Error(`Expected only one bundle, got ${bundles.length}`)

    const outputBundle = bundle[bundles[0]]

    outputBundle.code = `/* eslint-disable */\nlet hook;\n\nmodule.exports.getContent = () => {\n  if (typeof hook === \`undefined\`)\n    hook = require('zlib').brotliDecompressSync(Buffer.from('${brotliCompressSync(
      outputBundle.code.replace(/\r\n/g, `\n`)
    ).toString(`base64`)}', 'base64')).toString();\n\n  return hook;\n};\n`
  },
})

export default [
  {
    //external: ['pnpapi', 'eslint', '@typescript-eslint/parser', '@typescript-eslint/eslint-plugin'],
    external: ['pnpapi', 'eslint', 'typescript'],
    input: `./src/linter.worker.source.ts`,
    output: {
      file: `./src/linter.worker.content.js`,
      format: `cjs`,
      strict: false,
      preferConst: true,
    },
    plugins: [
      analyze(),
      externals({
        builtins: true,
        peerDeps: false,
        optDeps: false,
        devDeps: false,
        exclude: '@monstrs/code-lint',
      }),
      resolve({
        extensions: [`.mjs`, `.js`, `.ts`, `.tsx`, `.json`],
        //rootDir: path.join(__dirname, `../../`),
        //jail: path.join(__dirname, `../../`),
        preferBuiltins: true,
      }),
      esbuild({ tsconfig: false, target: `node12` }),
      cjs({
        transformMixedEsModules: true,
        extensions: [`.js`, `.ts`],
        ignoreDynamicRequires: true,
      }),
      //terser({ ecma: 2019 }),
      json(),
      wrapOutput(),
    ],
  },
]
//"@typescript-eslint/eslint-plugin": "^5.4.0",
//"@typescript-eslint/parser": "^5.4.0",
