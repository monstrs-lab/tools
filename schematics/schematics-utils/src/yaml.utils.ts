import { Rule }                         from '@angular-devkit/schematics'

import { SchematicContext }       from '@angular-devkit/schematics'

import { Tree } from '@angular-devkit/schematics'

import { load }                         from 'js-yaml'
import { dump }                         from 'js-yaml'

export const readYamlInTree = <T = any>(host: Tree, path: string): T => {
  if (!host.exists(path)) {
    throw new Error(`Cannot find ${path}`)
  }

  return load(host.read(path)!.toString('utf-8'))
}

export const updateYamlInTree = <T = any, O = T>(
    path: string,
    callback: (yaml: T, context: SchematicContext) => O
  ): Rule =>
  (host: Tree, context: SchematicContext): Tree => {
    if (!host.exists(path)) {
      return host
    }

    host.overwrite(
      path,
      dump(callback(readYamlInTree(host, path), context), { noArrayIndent: true, lineWidth: -1 })
    )

    return host
  }
