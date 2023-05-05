import type { IPackageJson }      from 'package-json-type'

import { readFile }               from 'node:fs/promises'
import { join }                   from 'node:path'

import { WorkspaceConfiguration } from '@monstrs/code-configuration'

export class WebpackExternals {
  #externals: Array<string> = []

  #dependencies: Array<string> = []

  constructor(private readonly cwd: string) {}

  async loadPackageJson(): Promise<IPackageJson> {
    try {
      return JSON.parse(await readFile(join(this.cwd, 'package.json'), 'utf-8'))
    } catch {
      return {}
    }
  }

  async loadDependencies() {
    const { dependencies = {} } = await this.loadPackageJson()

    return Object.keys(dependencies)
  }

  async loadExternals() {
    const { service } = await WorkspaceConfiguration.find(this.cwd)

    return service?.externals || []
  }

  async build() {
    this.#externals = await this.loadExternals()
    this.#dependencies = await this.loadDependencies()

    return this.externals
  }

  private externals = ({ context, request }: { context?: any; request?: any }, callback) => {
    if (this.#dependencies.includes(request)) {
      return callback(null, request, 'module')
    }

    if (this.#externals.includes(request)) {
      return callback(null, request, 'import')
    }

    return callback()
  }
}
