import deepmerge                from 'deepmerge'
import type { Diagnostic }      from 'typescript'
import type { CompilerOptions } from 'typescript'

import tsconfig                 from '@monstrs/config-typescript'

import { TypeScriptWorker }     from './typescript.worker'

class TypeScript {
  constructor(private readonly cwd: string) {}

  check(include: Array<string> = []): Promise<Array<Diagnostic>> {
    return this.run(include)
  }

  build(
    include: Array<string> = [],
    override: Partial<CompilerOptions> = {}
  ): Promise<Array<Diagnostic>> {
    return this.run(include, override, false)
  }

  private run(
    include: Array<string> = [],
    override: Partial<CompilerOptions> = {},
    noEmit = true
  ): Promise<Array<Diagnostic>> {
    const config = deepmerge(tsconfig, { compilerOptions: override }, {
      include,
    } as any)

    return TypeScriptWorker.run(this.cwd, config, noEmit)
  }
}

export { TypeScript }
