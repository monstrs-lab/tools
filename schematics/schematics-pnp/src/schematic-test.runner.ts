/* eslint-disable */

import { SchematicEngine }                                from '@angular-devkit/schematics'
import { SchematicTestRunner as BaseSchematicTestRunner } from '@angular-devkit/schematics/testing'

import { NodePnpTestEngineHost }                          from './node-pnp-test-engine.host'

// @ts-ignore
export class SchematicTestRunner extends BaseSchematicTestRunner {
  private _engineHost = new NodePnpTestEngineHost()
  private _engine: SchematicEngine<{}, {}> = new SchematicEngine(this._engineHost)
}
