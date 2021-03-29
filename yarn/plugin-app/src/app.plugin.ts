import { Plugin }                  from '@yarnpkg/core'

import { AppLibraryBuildCommand }  from './app-library-bulid.command'
import { AppRendererBuildCommand } from './app-renderer-build.command'
import { AppRendererDevCommand }   from './app-renderer-dev.command'
import { AppServiceBuildCommand }  from './app-service-build.command'
import { AppServiceDevCommand }    from './app-service-dev.command'

export const plugin: Plugin = {
  commands: [
    AppLibraryBuildCommand,
    AppRendererBuildCommand,
    AppRendererDevCommand,
    AppServiceBuildCommand,
    AppServiceDevCommand,
  ],
}
