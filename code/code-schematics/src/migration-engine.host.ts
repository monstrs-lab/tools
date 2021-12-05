import { NodeModulesEngineHost } from '@angular-devkit/schematics/tools'

export class MigrationEngineHost extends NodeModulesEngineHost {
  // eslint-disable-next-line no-underscore-dangle
  protected _resolveCollectionPath(name: string): string {
    return name
  }
}
