import type { Workspace } from '@yarnpkg/core'

export const beforeWorkspacePacking = (workspace: Workspace, rawManifest: any) => {
  if (rawManifest.name === '@monstrs/yarn-cli') {
    // eslint-disable-next-line no-param-reassign
    rawManifest.dependencies = new Proxy({}, { set: () => true })
  }
}
