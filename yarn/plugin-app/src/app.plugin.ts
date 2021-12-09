import { Plugin }                 from '@yarnpkg/core'

import { AppLibraryBuildCommand } from './app-library-bulid.command'
import { AppPackSourceCommand }   from './app-pack-source.command'
import { AppPackCommand }         from './app-pack.command'
import { AppServiceBuildCommand } from './app-service-build.command'

export const plugin: Plugin = {
  commands: [
    AppLibraryBuildCommand,
    AppServiceBuildCommand,
    AppPackSourceCommand,
    AppPackCommand,
  ],
}
