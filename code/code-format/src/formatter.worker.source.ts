import * as plugin    from '@monstrs/prettier-plugin'

import babel          from 'prettier/parser-babel'
import graphql        from 'prettier/parser-graphql'
import markdown       from 'prettier/parser-markdown'
import typescript     from 'prettier/parser-typescript'
import yaml           from 'prettier/parser-yaml'
import { promises }   from 'fs'
import { format }     from 'prettier/standalone'
import { parentPort } from 'worker_threads'
import { workerData } from 'worker_threads'

import config         from '@monstrs/config-prettier'

const { files } = workerData

// eslint-disable-next-line no-async-promise-executor
const execution = new Promise(async (resolve, reject) => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const filename of files) {
      // eslint-disable-next-line no-await-in-loop
      const input = await promises.readFile(filename, 'utf8')

      const output = format(input, {
        ...config,
        filepath: filename,
        plugins: [yaml, markdown, graphql, babel, typescript, plugin],
      })

      if (output !== input && output) {
        // eslint-disable-next-line no-await-in-loop
        await promises.writeFile(filename, output, 'utf8')
      }
    }
  } catch (error) {
    reject(error)
  }

  resolve(null)
})

execution.then(() => parentPort!.postMessage(''))
