import ts                   from 'typescript'

import { base }             from './config'
import { groupDiagnostics } from './diagnostics'
import { formatDiagnostic } from './diagnostics'

class TypeScript {
  cwd: string

  constructor(projectCwd?: string) {
    this.cwd = projectCwd || process.cwd()
  }

  formatDiagnostic(diagnostic, raw?) {
    return formatDiagnostic(this.cwd, diagnostic, raw)
  }

  check(include = []) {
    const config = this.getCompilerConfig(include)

    if (config.errors && config.errors.length > 0) {
      return groupDiagnostics(config.errors)
    }

    return this.run(config)
  }

  private run(config, noEmit = true) {
    const program = ts.createProgram(config.fileNames, {
      ...config.options,
      noEmit,
    })

    const result = program.emit()

    return groupDiagnostics(ts.getPreEmitDiagnostics(program).concat(result.diagnostics))
  }

  private getCompilerConfig(include = []) {
    return ts.parseJsonConfigFileContent({ ...base, include }, ts.sys, this.cwd)
  }
}

export { TypeScript }
