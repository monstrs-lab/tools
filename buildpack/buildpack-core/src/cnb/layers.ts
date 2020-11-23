import { join } from 'path'

import { Layer } from './layer'

export class Layers {
  private layers: Map<string, Layer> = new Map()

  constructor(readonly path: string) {}

  get(
    name: string,
    build: boolean = false,
    cache: boolean = false,
    launch: boolean = false
  ): Layer {
    if (this.layers.has(name)) {
      return this.layers.get(name)!
    }

    const layer = new Layer(name, join(this.path, name), build, cache, launch)

    layer.load(this.path)

    this.layers.set(name, layer)

    return layer
  }

  save() {
    // eslint-disable-next-line no-restricted-syntax
    for (const layer of this.layers.values()) {
      layer.save(this.path)
    }
  }
}
