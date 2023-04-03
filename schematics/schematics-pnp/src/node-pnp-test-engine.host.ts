/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/* eslint-disable */

import { TaskConfiguration }          from '@angular-devkit/schematics'
import { TaskConfigurationGenerator } from '@angular-devkit/schematics'
import { TaskId }                     from '@angular-devkit/schematics'
import { FileSystemSchematicContext } from '@angular-devkit/schematics/tools'

import { NodePnpEngineHost }          from './node-pnp-engine.host'

/**
 * An EngineHost that uses a registry to super seed locations of collection.json files, but
 * revert back to using node modules resolution. This is done for testing.
 */
export class NodePnpTestEngineHost extends NodePnpEngineHost {
  private _collections = new Map<string, string>()
  private _tasks = [] as TaskConfiguration[]

  get tasks() {
    return this._tasks
  }

  clearTasks() {
    this._tasks = []
  }

  registerCollection(name: string, path: string) {
    this._collections.set(name, path)
  }

  override transformContext(context: FileSystemSchematicContext): FileSystemSchematicContext {
    const oldAddTask = context.addTask
    context.addTask = (task: TaskConfigurationGenerator<{}>, dependencies?: Array<TaskId>) => {
      this._tasks.push(task.toConfiguration())

      return oldAddTask.call(context, task, dependencies)
    }

    return context
  }

  protected override _resolveCollectionPath(name: string, requester?: string): string {
    const maybePath = this._collections.get(name)
    if (maybePath) {
      return maybePath
    }

    return super._resolveCollectionPath(name, requester)
  }
}
