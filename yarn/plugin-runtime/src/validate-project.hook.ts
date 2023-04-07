import type { Project } from '@yarnpkg/core'

import { structUtils }  from '@yarnpkg/core'

import semver           from 'semver'

import runtime          from '@monstrs/code-runtime/package.json' assert { type: 'json' }

export const validateProject = async (project: Project) => {
  if (project.topLevelWorkspace.manifest.raw.devDependencies) {
    const ident = structUtils.parseIdent(runtime.name)

    let descriptor = Array.from(project.topLevelWorkspace.manifest.devDependencies.values()).find(
      (target) => target.scope === ident.scope && target.name === ident.name
    )

    if (!descriptor) {
      descriptor = structUtils.makeDescriptor(ident, `^${runtime.version}`)
    }

    if (semver.valid(semver.coerce(descriptor.range))) {
      if (semver.lt(semver.coerce(descriptor.range), runtime.version)) {
        descriptor.range = `^${runtime.version}`
      }
    }

    project.topLevelWorkspace.manifest.devDependencies.set(descriptor.identHash, descriptor)
  }
}
