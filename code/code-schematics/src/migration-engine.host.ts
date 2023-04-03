import { NodePnpEngineHost } from '@monstrs/schematics-pnp'

export class MigrationEngineHost extends NodePnpEngineHost {
  // eslint-disable-next-line no-underscore-dangle
  protected _resolveCollectionPath(name: string): string {
    return name
  }
}
