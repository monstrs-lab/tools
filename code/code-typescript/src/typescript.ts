import type { ts as typescript }     from '@monstrs/tools-runtime/typescript'

import deepmerge                     from 'deepmerge'

import tsconfig                      from '@monstrs/config-typescript'

import { transformJsxToJsExtension } from './transformers/index.js'

class TypeScript {
  protected constructor(
    private readonly ts: typeof typescript,
    private readonly cwd: string
  ) {}

  static async initialize(cwd: string): Promise<TypeScript> {
    const { ts } = await import('@monstrs/tools-runtime/typescript')

    return new TypeScript(ts, cwd)
  }

  async check(include: Array<string> = []): Promise<Array<typescript.Diagnostic>> {
    return this.run(include)
  }

  async build(
    include: Array<string> = [],
    override: Partial<typescript.CompilerOptions> = {}
  ): Promise<Array<typescript.Diagnostic>> {
    return this.run(include, override, false)
  }

  private async run(
    include: Array<string> = [],
    override: Partial<typescript.CompilerOptions> = {},
    noEmit = true
  ): Promise<Array<typescript.Diagnostic>> {
    const config = deepmerge(tsconfig, { compilerOptions: override }, {
      compilerOptions: { rootDir: this.cwd },
      include,
    } as object)

    const { fileNames, options, errors } = this.ts.parseJsonConfigFileContent(
      config,
      this.ts.sys,
      this.cwd
    )

    if (errors.length > 0) {
      return errors
    }

    const program = this.ts.createProgram(fileNames, {
      ...options,
      noEmit,
    })

    const result = program.emit(undefined, undefined, undefined, undefined, {
      after: [transformJsxToJsExtension],
    })

    return this.filterDiagnostics(this.ts.getPreEmitDiagnostics(program).concat(result.diagnostics))
  }

  private filterDiagnostics(
    diagnostics: Array<typescript.Diagnostic>
  ): Array<typescript.Diagnostic> {
    return diagnostics
      .filter((diagnostic) => diagnostic.code !== 2209)
      .filter(
        (diagnostic) => !(diagnostic.code === 1479 && diagnostic.file?.fileName.includes('/.yarn/'))
      )
      .filter(
        (diagnostic) => !(diagnostic.code === 2834 && diagnostic.file?.fileName.includes('/.yarn/'))
      )
      .filter(
        (diagnostic) =>
          !(diagnostic.code === 7016 && diagnostic.file?.fileName.includes('/lexical/'))
      )
      .filter(
        (diagnostic) =>
          !(diagnostic.code === 6133 && diagnostic.file?.fileName.includes('/@yarnpkg/libui/'))
      )
      .filter(
        (diagnostic) =>
          !(
            [2315, 2411, 2304, 7006, 7016].includes(diagnostic.code) &&
            diagnostic.file?.fileName.includes('/@strapi/')
          )
      )
      .filter(
        (diagnostic) =>
          !(
            [2688, 2307, 2503].includes(diagnostic.code) &&
            diagnostic.file?.fileName.includes('/pkg-tests-core/')
          )
      )
      .filter(
        (diagnostic) =>
          !(
            [2307].includes(diagnostic.code) &&
            diagnostic.file?.fileName.includes('/@nestjs/testing/')
          )
      )
  }
}

export { TypeScript }
