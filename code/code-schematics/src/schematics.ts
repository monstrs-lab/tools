import { dirname }            from 'node:path'
import { join }               from 'node:path'

import { NodeJsSyncHost }     from '@angular-devkit/core/node'
import { NodeWorkflow }       from '@angular-devkit/schematics/tools'
import { normalize }          from '@angular-devkit/core'
import { virtualFs }          from '@angular-devkit/core'

import { MigrationsWorkflow } from './migration.workflow'
import { expandCollections }  from './utils'
import { resolveSchematics }  from './utils'

export class Schematics {
  constructor(
    private readonly cwd: string,
    private readonly force = false,
    private readonly dryRun = false
  ) {}

  init(schematic: string, options = {}) {
    const workflow = new NodeWorkflow(this.cwd, {
      force: this.force,
      dryRun: this.dryRun,
      resolvePaths: [this.cwd],
      schemaValidation: true,
    })

    return workflow
      .execute({
        collection: resolveSchematics(this.cwd),
        schematic,
        options,
        allowPrivate: false,
        debug: true,
      })
      .toPromise()
  }

  async migrate(schematicName: string, migrationVersion: string, options = {}) {
    const host = new virtualFs.ScopedHost(new NodeJsSyncHost(), normalize(this.cwd))
    const workflow = new MigrationsWorkflow(host)

    const collections = expandCollections(this.cwd, resolveSchematics(this.cwd), schematicName)

    const migrations = collections
      .map((collection) => {
        const schematic = collection.description.schematics[schematicName]

        if (!schematic) {
          return []
        }

        const migrationsPath = join(
          dirname(collection.description.path),
          dirname(schematic.schema!),
          'migrations.json'
        )

        // eslint-disable-next-line global-require
        const data = require(migrationsPath)

        return Object.keys(data.schematics)
          .map((key) => ({
            collection: migrationsPath,
            schematic: key,
            migration: data.schematics[key],
          }))
          .filter((config) => config.migration.version > migrationVersion)
      })
      .flat()

    // eslint-disable-next-line no-restricted-syntax
    for (const migration of migrations) {
      // eslint-disable-next-line no-await-in-loop
      await workflow
        .execute({
          collection: migration.collection,
          schematic: migration.schematic,
          debug: false,
          options,
        })
        .toPromise()
    }
  }
}
