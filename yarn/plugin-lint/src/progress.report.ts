import { StreamReport }            from '@yarnpkg/core'

import type { LintProgressReport } from '@monstrs/yarn-runtime'

export class ProgressReport implements LintProgressReport {
  progress!: any

  constructor(private readonly report: StreamReport) {}

  start(files: Array<string>) {
    this.progress = StreamReport.progressViaCounter(files.length)
    this.report.reportProgress(this.progress)
  }

  lint() {
    this.progress.tick()
  }

  end() {
    this.progress.set(100)
  }
}
