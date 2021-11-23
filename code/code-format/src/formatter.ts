import { relative }        from 'node:path'

import globby              from 'globby'
import ignorer             from 'ignore'

import { FormatterWorker } from './formatter.worker'
import { ignore }          from './formatter.config'
import { createPatterns }  from './formatter.config'
import { config }          from './formatter.config'

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
    await FormatterWorker.run(
      ignorer()
        .add(ignore)
        .filter(files.map((filepath) => relative(this.cwd, filepath))),
      config
    )
  }

  async formatProject() {
    const files = await globby(createPatterns(this.cwd), { dot: true, onlyFiles: true })

    await this.formatFiles(files)
  }
}
