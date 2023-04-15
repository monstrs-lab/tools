import type { Project } from '@yarnpkg/core'

import { PortablePath } from '@yarnpkg/fslib'
import { xfs }          from '@yarnpkg/fslib'
import { ppath }        from '@yarnpkg/fslib'

import deepmerge        from 'deepmerge'

import tsconfig         from '@monstrs/config-typescript'

const combineMerge = (target, source, options) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })

  return destination
}

const isUpdateNeeded = (from: object, to: object) =>
  Object.keys(from).some((key) => {
    if (Array.isArray(from[key])) {
      return false
    }

    return from[key] !== to[key]
  })

export const afterAllInstalled = async (project: Project, options) => {
  if (!options.immutable) {
    const tsconfigpath = ppath.join(project.topLevelWorkspace.cwd, 'tsconfig.json' as PortablePath)

    const exists = (await xfs.existsPromise(tsconfigpath))
      ? await xfs.readJsonPromise(tsconfigpath)
      : { compilerOptions: {} }

    if (isUpdateNeeded(tsconfig.compilerOptions, exists.compilerOptions)) {
      await xfs.writeJsonPromise(
        tsconfigpath,
        deepmerge(
          exists,
          { compilerOptions: tsconfig.compilerOptions },
          { arrayMerge: combineMerge }
        )
      )
    }
  }
}
