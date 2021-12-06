import { dirname }            from 'node:path'
import { join }               from 'node:path'

import { NodeJsSyncHost }     from '@angular-devkit/core/node'
import { NodeWorkflow }       from '@angular-devkit/schematics/tools'
import { normalize }          from '@angular-devkit/core'
import { virtualFs }          from '@angular-devkit/core'

import { MigrationsWorkflow } from './migration.workflow'
import { expandCollections }  from './utils'
import { resolveSchematics }  from './utils'

import { SchematicsWorker } from './schematics.worker'

export class Schematics {
  constructor(
    private readonly cwd: string,
    private readonly force = false,
    private readonly dryRun = false
  ) {}

  init(schematicName: string, options = {}) {
    return SchematicsWorker.run(
      {
        type: 'generate',
        force: this.force,
        dryRun: this.dryRun,
        schematicName,
        options,
      }
    )
  }

  migrate(schematicName: string, migrationVersion: string, options = {}) {
    return SchematicsWorker.run(
      {
        type: 'migrate',
        force: this.force,
        dryRun: this.dryRun,
        schematicName,
        migrationVersion,
        options,
      }
    )
  }
}
