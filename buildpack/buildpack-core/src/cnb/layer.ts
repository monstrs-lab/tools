import fs                   from 'fs'
import { AnyJson }          from '@iarna/toml'
import { parse, stringify } from '@iarna/toml'
import { join }             from 'path'

export class Layer {
  metadata: { [key: string]: string | null } = {}

  constructor(
    readonly name: string,
    readonly path: string,
    readonly build: boolean,
    readonly cache: boolean,
    readonly launch: boolean
  ) {}

  reset() {
    this.metadata = {}

    if (fs.existsSync(this.path)) {
      fs.rmdirSync(this.path)
    }

    fs.mkdirSync(this.path)
  }

  load(layersPath: string) {
    const metadataPath = join(layersPath, `${this.name}.toml`)

    if (fs.existsSync(metadataPath)) {
      try {
        const parsed: any = parse(fs.readFileSync(metadataPath).toString())

        this.metadata = parsed.metadata || {}
      } catch (error) {
        console.log(error) // eslint-disable-line
      }
    }
  }

  save(layersPath: string) {
    const metadataPath = join(layersPath, `${this.name}.toml`)

    fs.writeFileSync(
      metadataPath,
      stringify({
        metadata: this.metadata as AnyJson,
        build: this.build,
        cache: this.cache,
        launch: this.launch,
      })
    )
  }

  setMetadata(key: string, value: string | null): void {
    this.metadata[key] = value
  }
}
