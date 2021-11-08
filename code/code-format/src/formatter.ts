import { writeFile }              from 'node:fs/promises'
import { readFile }               from 'node:fs/promises'
import { relative }               from 'node:path'

import globby                     from 'globby'
import ignore                     from 'ignore'
import { format }                 from 'prettier'

import { ignore as ignoreConfig } from './config'
import { createPatterns }         from './config'
import { config }                 from './config'

export class Formatter {
  constructor(private readonly cwd: string) {}

  async format(files?: Array<string>) {
    if (files && files.length > 0) {
      await this.formatFiles(files)
    } else {
      await this.formatProject()
    }
  }

  async formatFiles(files: Array<string> = []) {
    const ignorer = ignore().add(ignoreConfig)

    const totalFiles = files.filter(
      (filePath) => ignorer.filter([relative(this.cwd, filePath)]).length !== 0
    )

    const formatPromises = totalFiles.map(async (filename: string) => {
      const input = await readFile(filename, 'utf8')

      const output = format(input, { ...config, filepath: filename })

      const isDifferent = output !== input

      if (isDifferent) {
        await writeFile(filename, output, 'utf8')
      }
    })

    await Promise.all(formatPromises)
  }

  async formatProject() {
    const files = await globby(createPatterns(this.cwd), { dot: true, onlyFiles: true })

    await this.formatFiles(files)
  }
}
