import { BaseWorkflow }        from '@angular-devkit/schematics/src/workflow'
import { virtualFs }           from '@angular-devkit/core'

import { MigrationEngineHost } from './migration-engine.host'

export class MigrationsWorkflow extends BaseWorkflow {
  constructor(host: virtualFs.Host) {
    super({
      host,
      engineHost: new MigrationEngineHost(),
      force: true,
      dryRun: false,
    })
  }
}
