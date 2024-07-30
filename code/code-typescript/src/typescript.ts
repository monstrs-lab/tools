import type { ts as typescript }           from '@monstrs/tools-runtime/typescript'

import EventEmitter                        from 'node:events'

import deepmerge                           from 'deepmerge'

import tsconfig                            from '@monstrs/config-typescript'

import { createTransformJsxToJsExtension } from './transformers/index.js'

export class TypeScript extends EventEmitter {
  protected constructor(
    private readonly ts: typeof typescript,
    private readonly cwd: string
  ) {
    super()
  }

  static async initialize(cwd: string): Promise<TypeScript> {
    const { ts } = await import('@monstrs/tools-runtime/typescript')

    return new TypeScript(ts, cwd)
  }

  async check(include: Array<string> = []): Promise<Array<typescript.Diagnostic>> {
    const config = deepmerge(tsconfig, {
      compilerOptions: { rootDir: this.cwd },
      include,
    })

    const { fileNames, options, errors } = this.ts.parseJsonConfigFileContent(
      config,
      this.ts.sys,
      this.cwd
    )

    if (errors.length > 0) {
      return errors
    }

    this.emit('start', { files: fileNames })

    const program = this.ts.createProgram(fileNames, {
      ...options,
      noEmit: true,
    })

    const result = program.emit()

    const diagnostics = this.filterDiagnostics(
      this.ts.getPreEmitDiagnostics(program).concat(result.diagnostics)
    )

    this.emit('end', { diagnostics })

    return diagnostics
  }

  async build(
    include: Array<string> = [],
    override: Partial<typescript.CompilerOptions> = {}
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

    this.emit('start', { files: fileNames })

    const program = this.ts.createProgram(fileNames, {
      ...options,
      noEmit: false,
    })

    const beforeTransformer: typescript.TransformerFactory<typescript.SourceFile> = (_) => 
      (sourceFile) => {
        this.emit('build:start', { file: sourceFile.fileName })

        return sourceFile
      }
    

    const afterTransformer: typescript.TransformerFactory<typescript.SourceFile> = (_) => (sourceFile) => {
        this.emit('build:end', { file: sourceFile.fileName })

        return sourceFile
      }

    const result = program.emit(undefined, undefined, undefined, undefined, {
      before: [beforeTransformer],
      after: [afterTransformer, createTransformJsxToJsExtension(this.ts)],
    })

    const diagnostics = this.filterDiagnostics(
      this.ts.getPreEmitDiagnostics(program).concat(result.diagnostics)
    )

    this.emit('end', { diagnostics })

    return diagnostics
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
