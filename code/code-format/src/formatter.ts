import EventEmitter       from 'node:events'
import { writeFile }      from 'node:fs/promises'
import { readFile }       from 'node:fs/promises'
import { relative }       from 'node:path'

import * as babel         from 'prettier/plugins/babel'
import * as estree        from 'prettier/plugins/estree'
import * as graphql       from 'prettier/plugins/graphql'
import * as markdown      from 'prettier/plugins/markdown'
import * as typescript    from 'prettier/plugins/typescript'
import * as yaml          from 'prettier/plugins/yaml'
import { globby }         from 'globby'
import { format }         from 'prettier/standalone'
import ignorer            from 'ignore'

import config             from '@monstrs/config-prettier'
import plugin             from '@monstrs/prettier-plugin'

import { ignore }         from './formatter.patterns.js'
import { createPatterns } from './formatter.patterns.js'

export class Formatter extends EventEmitter {
  protected constructor(private readonly cwd: string) {
    super()
  }

  static async initialize(cwd: string): Promise<Formatter> {
    return new Formatter(cwd)
  }

  async format(files?: Array<string>): Promise<void> {
    const filesForFormat =
      files && files.length > 0
        ? files
        : await globby(createPatterns(this.cwd), {
            dot: true,
          })

    await this.formatFiles(filesForFormat)
  }

  protected async formatFiles(files: Array<string> = []): Promise<void> {
    const fileForFormat = ignorer
      .default()
      .add(ignore)
      .filter(files.map((filepath) => relative(this.cwd, filepath)))

    this.emit('start', { files: fileForFormat })

    for await (const filename of fileForFormat) {
      this.emit('format:start', { file: filename })

      const input = await readFile(filename, 'utf8')

      const output = await format(input, {
        ...config,
        filepath: filename,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins: [estree as any, yaml, markdown, graphql, babel, typescript, plugin],
      })

      if (output !== input && output) {
        await writeFile(filename, output, 'utf8')

        this.emit('format:end', { file: filename, changed: true })
      } else {
        this.emit('format:end', { file: filename, changed: false })
      }
    }

    this.emit('end')
  }
}
