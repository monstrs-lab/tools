import { mkdtemp }             from 'node:fs/promises'
import { join }                from 'node:path'
import { fileURLToPath }       from 'node:url'

import { Tree }                from '@angular-devkit/schematics'
import { SchematicEngine }     from '@angular-devkit/schematics'
import { SchematicTestRunner } from '@angular-devkit/schematics/testing'
import { UnitTestTree }        from '@angular-devkit/schematics/testing'

import { NodePnpEngineHost }   from './node-pnp-engine.host'

describe('code-schematics', () => {
  describe('node-pnp-engine.host', () => {
    let tmpDir!: string
    let previousDir!: string

    beforeEach(async () => {
      tmpDir = await mkdtemp('code-schematics-node-pnp-engine-host')
      previousDir = process.cwd()
      process.chdir(tmpDir)
    })

    afterEach(() => process.chdir(previousDir))

    it('should properly create collections with explicit collection path', () => {
      //createFakeNpmModule();

      const engineHost = new NodePnpEngineHost()
      const engine = new SchematicEngine(engineHost)

      //expect(() => {
      //  engine.createCollection(join(prefix, '@angular/core', './schematics/migrations.json'));
      //}).not.toThrow();
    })
  })
})
