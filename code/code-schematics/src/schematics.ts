import type { DryRunEvent } from '@angular-devkit/schematics'

import { SchematicsWorker } from './schematics.worker'

export class Schematics {
  constructor(
    private readonly cwd: string,
    private readonly force = false,
    private readonly dryRun = false
  ) {}

  init(schematicName: string, options = {}): Promise<Array<DryRunEvent>> {
    return SchematicsWorker.run({
      type: 'generate',
      cwd: this.cwd,
      force: this.force,
      dryRun: this.dryRun,
      schematicName,
      options,
    })
  }

  migrate(
    schematicName: string,
    migrationVersion: string,
    options = {}
  ): Promise<Array<DryRunEvent>> {
    return SchematicsWorker.run({
      type: 'migrate',
      cwd: this.cwd,
      force: this.force,
      dryRun: this.dryRun,
      schematicName,
      migrationVersion,
      options,
    })
  }
}
