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

export class Formatter {
  constructor(private readonly cwd: string) {}

  async formatFiles(files: Array<string> = []): Promise<void> {
    const formatFiles = ignorer
      .default()
      .add(ignore)
      .filter(files.map((filepath) => relative(this.cwd, filepath)))

    for await (const filename of formatFiles) {
      const input = await readFile(filename, 'utf8')

      const output = await format(input, {
        ...config,
        filepath: filename,
        // @ts-expect-error
        plugins: [estree, yaml, markdown, graphql, babel, typescript, plugin],
      })

      if (output !== input && output) {
        await writeFile(filename, output, 'utf8')
      }
    }
  }

  async format(files?: Array<string>): Promise<void> {
    if (files && files.length > 0) {
      await this.formatFiles(files)
    } else {
      await this.formatProject()
    }
  }

  async formatProject(): Promise<void> {
    const files = await globby(createPatterns(this.cwd), {
      dot: true,
    })

    await this.formatFiles(files)
  }
}
