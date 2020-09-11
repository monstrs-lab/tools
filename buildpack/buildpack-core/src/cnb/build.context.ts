import { Layers } from './layers'

export class BuildContext {
  constructor(
    readonly workingDir: string,
    readonly buildpackPath: string,
    readonly layers: Layers
  ) {}
}
