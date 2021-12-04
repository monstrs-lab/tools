import { ESLint }     from 'eslint'
import { parentPort } from 'worker_threads'
import { workerData } from 'worker_threads'

import baseConfig     from '@monstrs/config-eslint'

const plugins = {
  //import: require('eslint-plugin-import'),
  react: require('eslint-plugin-react'),
  'jsx-a11y': require('eslint-plugin-jsx-a11y'),
  'react-hooks': require('eslint-plugin-react-hooks'),
  '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
  //prettier: require('eslint-plugin-prettier'),
  'eslint-plugin-react-hooks': require('eslint-plugin-react-hooks'),
}

const { files } = workerData

const eslint = new ESLint({
  // @ts-ignore
  baseConfig,
  plugins,
})

eslint.lintFiles(files).then((results) => {
  parentPort!.postMessage(results)
})
