import deepmerge                     from 'deepmerge'

import tsconfig                      from '@monstrs/config-typescript'
import { ts }                        from '@monstrs/code-runtime/typescript'

import { transformJsxToJsExtension } from './transformers/index.js'

class TypeScript {
  constructor(private readonly cwd: string) {}

  check(include: Array<string> = []): Promise<Array<ts.Diagnostic>> {
    return this.run(include)
  }

  build(
    include: Array<string> = [],
    override: Partial<ts.CompilerOptions> = {}
  ): Promise<Array<ts.Diagnostic>> {
    return this.run(include, override, false)
  }

  private async run(
    include: Array<string> = [],
    override: Partial<ts.CompilerOptions> = {},
    noEmit = true
  ): Promise<Array<ts.Diagnostic>> {
    const config = deepmerge(tsconfig, { compilerOptions: override }, {
      compilerOptions: { rootDir: this.cwd },
      include,
    } as any)

    const { fileNames, options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, this.cwd)

    if (errors?.length > 0) {
      return errors
    }

    const program = ts.createProgram(fileNames, {
      ...options,
      noEmit,
    })

    const result = program.emit(undefined, undefined, undefined, undefined, {
      after: [transformJsxToJsExtension],
    })

    return this.filterDiagnostics(ts.getPreEmitDiagnostics(program).concat(result.diagnostics))
  }

  private filterDiagnostics(diagnostics: Array<ts.Diagnostic>): Array<ts.Diagnostic> {
    return diagnostics
      .filter((diagnostic) => diagnostic.code !== 2209)
      .filter(
        (diagnostic) => !(diagnostic.code === 1479 && diagnostic.file?.fileName.includes('/.yarn/'))
      )
      .filter(
        (diagnostic) => !(diagnostic.code === 2834 && diagnostic.file?.fileName.includes('/.yarn/'))
      )
  }
}

export { TypeScript }
