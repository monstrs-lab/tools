/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/* eslint-disable */

import { createRequire } from 'node:module'
import { dirname }       from 'node:path'
import { resolve }       from 'node:path'

export class ExportStringRef<T> {
  private _ref?: T
  private _module: string
  private _path: string

  constructor(ref: string, parentPath: string = process.cwd(), inner = true) {
    const require = createRequire(import.meta.url)

    const [path, name] = ref.split('#', 2)
    this._module = path[0] == '.' ? resolve(parentPath, path) : path
    this._module = require.resolve(this._module)
    this._path = dirname(this._module)

    if (inner) {
      this._ref = require(this._module)[name || 'default']
    } else {
      this._ref = require(this._module)
    }
  }

  get ref() {
    return this._ref
  }
  get module() {
    return this._module
  }
  get path() {
    return this._path
  }
}
