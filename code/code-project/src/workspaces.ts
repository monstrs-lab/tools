/* eslint-disable no-restricted-syntax */

import { Configuration, Project, Workspace } from '@yarnpkg/core'
import { PortablePath }                      from '@yarnpkg/fslib'
import { getPluginConfiguration }            from '@yarnpkg/cli'

import { getChangedFiles }                   from '@monstrs/code-changes'

const getWorkspaceChildrenRecursive = (
  rootWorkspace: Workspace,
  project: Project
): Array<Workspace> => {
  const workspaceList: Array<Workspace> = []
  // @ts-ignore
  for (const childWorkspaceCwd of rootWorkspace.workspacesCwds) {
    const childWorkspace = project.workspacesByCwd.get(childWorkspaceCwd)
    if (childWorkspace) {
      workspaceList.push(childWorkspace, ...getWorkspaceChildrenRecursive(childWorkspace, project))
    }
  }
  return workspaceList
}

export const getWorkspaces = async (
  byFilePath?: Array<string>,
  withDependents?: boolean
): Promise<Array<Workspace>> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )

  const { project } = await Project.find(configuration, process.cwd() as PortablePath)

  const rootWorkspace = project.topLevelWorkspace

  const workspaces = [rootWorkspace, ...getWorkspaceChildrenRecursive(rootWorkspace, project)]

  if (!(byFilePath && Array.isArray(byFilePath))) {
    return workspaces
  }

  const workspacesByFilePath: Set<Workspace> = new Set()

  byFilePath.forEach((filePath) => {
    const workspace = project.tryWorkspaceByFilePath(filePath as PortablePath)

    if (workspace && !workspacesByFilePath.has(workspace)) {
      workspacesByFilePath.add(workspace)
    }
  })

  if (!withDependents) {
    return Array.from(workspacesByFilePath)
  }

  const withDependentsWorkspaces = {}

  const collectDependents = (workspace) => {
    const resolvedSet = new Map([
      ...workspace.manifest.dependencies,
      ...workspace.manifest.devDependencies,
    ])

    // @ts-ignore
    for (const descriptor of resolvedSet.values()) {
      const nested = project.tryWorkspaceByDescriptor(descriptor as any)

      if (nested) {
        if (!withDependentsWorkspaces[nested.anchoredLocator.locatorHash]) {
          withDependentsWorkspaces[nested.anchoredLocator.locatorHash] = new Set()
        }

        if (!withDependentsWorkspaces[nested.anchoredLocator.locatorHash].has(workspace)) {
          withDependentsWorkspaces[nested.anchoredLocator.locatorHash].add(workspace)
        }

        collectDependents(nested)
      }
    }
  }

  workspaces.forEach((workspace) => {
    collectDependents(workspace)
  })

  const resultWithDependentsWorkspaces: Set<Workspace> = new Set()

  const combineDependents = (workspace) => {
    if (!resultWithDependentsWorkspaces.has(workspace)) {
      resultWithDependentsWorkspaces.add(workspace)
    }

    const dependents = withDependentsWorkspaces[workspace.anchoredLocator.locatorHash]

    if (dependents) {
      dependents.forEach((dependent) => {
        if (!resultWithDependentsWorkspaces.has(dependent)) {
          resultWithDependentsWorkspaces.add(dependent)

          combineDependents(dependent)
        }
      })
    }
  }

  workspacesByFilePath.forEach((workspace) => {
    combineDependents(workspace)
  })

  return Array.from(resultWithDependentsWorkspaces)
}

export const getChangedWorkspaces = async () => {
  const workspaces: Array<Workspace> = await getWorkspaces()
  const changedFiles: Array<string> = await getChangedFiles()

  return workspaces.filter((workspace) =>
    changedFiles.some((changedFile) => changedFile.startsWith(workspace.cwd))
  )
}

export const getRootWorkspace = async (): Promise<Workspace> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )

  const { project } = await Project.find(configuration, process.cwd() as PortablePath)

  return project.topLevelWorkspace
}

export const getWorkspace = async (byFilePath: string): Promise<Workspace | undefined> => {
  const workspaces = await getWorkspaces([byFilePath])

  return workspaces[0]
}
