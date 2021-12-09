import typescriptEslint       from '@typescript-eslint/eslint-plugin'

import jsxA11y                from 'eslint-plugin-jsx-a11y'
import react                  from 'eslint-plugin-react'
import reactHooks             from 'eslint-plugin-react-hooks'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import { ESLint }             from 'eslint'
import { parentPort }         from 'worker_threads'
import { workerData }         from 'worker_threads'

import baseConfig             from '@monstrs/config-eslint'

const plugins = {
  react,
  'jsx-a11y': jsxA11y,
  'react-hooks': reactHooks,
  '@typescript-eslint': typescriptEslint,
  'eslint-plugin-react-hooks': eslintPluginReactHooks,
}

const { files, config } = workerData

const eslint = new ESLint({
  ...config,
  baseConfig,
  plugins,
})

eslint.lintFiles(files).then((results) => {
  parentPort!.postMessage(results)
})
