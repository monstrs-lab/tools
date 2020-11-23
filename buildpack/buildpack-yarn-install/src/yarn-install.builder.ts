import execa from 'execa'
import fs from 'fs'
import path from 'path'
import { log } from '@monstrs/log'
import { createHash } from 'crypto'

import { Builder } from '@monstrs/buildpack-core'
import { BuildContext } from '@monstrs/buildpack-core'
import { BuildResult } from '@monstrs/buildpack-core'

export class YarnInstallBuilder implements Builder {
  private logger = log.getLogger(YarnInstallBuilder.name)

  async build(ctx: BuildContext): Promise<BuildResult> {
    this.logger.info('Resolving installation process')

    const yarnLayer = ctx.layers.get('yarn-install', true, true)

    const unpluggedPath = '.yarn/unplugged'
    const layerUnpluggedPath = path.join(yarnLayer.path, 'unplugged')

    const cacheSha = this.getCacheSha(ctx.workingDir)
    const cached = cacheSha && cacheSha === yarnLayer.metadata.cacheSha

    if (!fs.existsSync(yarnLayer.path)) {
      fs.mkdirSync(yarnLayer.path)
    }

    if (cached) {
      if (fs.existsSync(unpluggedPath)) {
        fs.rmdirSync(unpluggedPath, { recursive: true })
      }

      if (fs.existsSync(layerUnpluggedPath)) {
        await execa('cp', ['--archive', layerUnpluggedPath, '.yarn'])
      }
    } else {
      await this.install(ctx.workingDir)

      if (fs.existsSync(unpluggedPath)) {
        if (fs.existsSync(layerUnpluggedPath)) {
          fs.rmdirSync(layerUnpluggedPath, { recursive: true })
        }

        fs.mkdirSync(layerUnpluggedPath)

        await execa('cp', ['--archive', unpluggedPath, yarnLayer.path])
      }

      yarnLayer.setMetadata('cacheSha', cacheSha)
    }
  }

  private async install(workingDir: string) {
    await execa('yarn', ['install', '--immutable', '--immutable-cache', '--inline-builds'])
  }

  private getCacheSha(workingDir: string) {
    const lockPath = path.join(workingDir, 'yarn.lock')

    if (!fs.existsSync(lockPath)) {
      return null
    }

    const content = fs.readFileSync(lockPath)

    return createHash('sha256').update(content).digest('hex')
  }
}
