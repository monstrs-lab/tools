import type { Project } from '@yarnpkg/core'

import semver           from 'semver'

import runtime          from '@monstrs/code-runtime/package.json' assert { type: 'json' }

export const validateProject = async (project: Project) => {
  if (project.topLevelWorkspace.manifest.raw.devDependencies) {
    const exist = project.topLevelWorkspace.manifest.raw.devDependencies[runtime.name]

    if (!exist || (semver.valid(exist) && semver.lt(exist, runtime.version))) {
      // eslint-disable-next-line no-param-reassign
      project.topLevelWorkspace.manifest.raw.devDependencies[runtime.name] = `^${runtime.version}`
    }
  }
}
