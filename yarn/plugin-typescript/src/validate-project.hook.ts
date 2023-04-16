import type { Project } from '@yarnpkg/core'

import { structUtils }  from '@yarnpkg/core'
import semver           from 'semver'

import runtime          from '@monstrs/code-runtime/package.json' assert { type: 'json' }

export const validateProject = async (project: Project) => {
  if (project.topLevelWorkspace.manifest.raw.devDependencies) {
    const ident = structUtils.parseIdent('typescript')

    let descriptor = Array.from(project.topLevelWorkspace.manifest.devDependencies.values()).find(
      (target) => target.scope === ident.scope && target.name === ident.name
    )

    if (!descriptor) {
      descriptor = structUtils.makeDescriptor(ident, runtime.dependencies.typescript)
    }

    if (semver.valid(semver.coerce(descriptor.range))) {
      if (
        semver.lt(semver.coerce(descriptor.range), semver.coerce(runtime.dependencies.typescript))
      ) {
        descriptor.range = runtime.dependencies.typescript
      }
    }

    project.topLevelWorkspace.manifest.devDependencies.set(descriptor.identHash, descriptor)
  }
}
