import type { Workspace }    from '@yarnpkg/core'
import type { Report }       from '@yarnpkg/core'
import type { PortablePath } from '@yarnpkg/fslib'
import type { Filename }     from '@yarnpkg/fslib'

import { Configuration }     from '@yarnpkg/core'
import { Project }           from '@yarnpkg/core'
import { Cache }             from '@yarnpkg/core'
import { CwdFS }             from '@yarnpkg/fslib'
import { tgzUtils }          from '@yarnpkg/core'
import { ppath }             from '@yarnpkg/fslib'
import { packUtils }         from '@yarnpkg/plugin-pack'

import { ExportCache }       from './export/ExportCache.js'
import { copyRcFile }        from './copy.utils.js'
import { copyPlugins }       from './copy.utils.js'
import { copyYarnRelease }   from './copy.utils.js'
import { genPackTgz }        from './export/exportUtils.js'
import { makeFetcher }       from './export/exportUtils.js'
import { makeResolver }      from './export/exportUtils.js'

export const pack = async (
  configuration: Configuration,
  project: Project,
  workspace: Workspace,
  report: Report,
  destination: PortablePath
): Promise<void> => {
  const cache = await Cache.find(configuration, { immutable: true })

  await project.restoreInstallState()

  await packUtils.prepareForPack(workspace, { report }, async () => {
    workspace.manifest.devDependencies.clear()

    const baseFs = new CwdFS(destination)

    const tgz = await genPackTgz(workspace)

    await tgzUtils.extractArchiveTo(tgz, baseFs, { stripComponents: 1 })

    const tmpConfiguration = Configuration.create(destination, destination, configuration.plugins)

    tmpConfiguration.values.set(
      `bstatePath`,
      ppath.join(destination, `build-state.yml` as Filename)
    )

    tmpConfiguration.values.set(`globalFolder`, configuration.get(`globalFolder`))
    tmpConfiguration.values.set(`packageExtensions`, configuration.get(`packageExtensions`))
    tmpConfiguration.values.set(`enableGlobalCache`, configuration.get(`enableGlobalCache`))
    tmpConfiguration.values.set(`pnpEnableEsmLoader`, configuration.get(`pnpEnableEsmLoader`))

    await tmpConfiguration.getPackageExtensions()

    const { project: tmpProject, workspace: tmpWorkspace } = await Project.find(
      tmpConfiguration,
      destination
    )

    tmpWorkspace!.manifest.dependencies = workspace.manifest.dependencies
    tmpWorkspace!.manifest.peerDependencies = workspace.manifest.peerDependencies
    tmpWorkspace!.manifest.resolutions = project.topLevelWorkspace.manifest.resolutions
    tmpWorkspace!.manifest.dependenciesMeta = project.topLevelWorkspace.manifest.dependenciesMeta
    tmpWorkspace!.manifest.devDependencies.clear()

    await report.startTimerPromise('Copy RC files', async () => {
      await copyRcFile(project, destination, report)
    })

    await report.startTimerPromise('Copy plugins', async () => {
      await copyPlugins(project, destination, report)
    })

    await report.startTimerPromise('Copy Yarn releases', async () => {
      await copyYarnRelease(project, destination, report)
    })

    tmpProject.lockfileNeedsRefresh = true

    await tmpProject.install({
      cache: await ExportCache.find(tmpConfiguration, cache),
      fetcher: makeFetcher(project),
      resolver: makeResolver(project),
      persistProject: true,
      report,
    })
  })
}
