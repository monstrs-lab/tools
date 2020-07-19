/* eslint-disable no-restricted-syntax */

import { Configuration, Project, Workspace } from '@yarnpkg/core'
import { PortablePath }                      from '@yarnpkg/fslib'
import { getPluginConfiguration }            from '@yarnpkg/cli'

import { getChangedFiles }                   from '@monstrs/code-changes'

const getWorkspaceChildrenRecursive = (
  rootWorkspace: Workspace,
  project: Project
): Array<Workspace> => {
  const workspaceList = []
  // @ts-ignore
  for (const childWorkspaceCwd of rootWorkspace.workspacesCwds) {
    const childWorkspace = project.workspacesByCwd.get(childWorkspaceCwd)
    if (childWorkspace) {
      workspaceList.push(childWorkspace, ...getWorkspaceChildrenRecursive(childWorkspace, project))
    }
  }
  return workspaceList
}

export const getWorkspaces = async (): Promise<Array<Workspace>> => {
  const configuration = await Configuration.find(
    process.cwd() as PortablePath,
    getPluginConfiguration()
  )
  const { project } = await Project.find(configuration, process.cwd() as PortablePath)

  const rootWorkspace = project.topLevelWorkspace

  return [rootWorkspace, ...getWorkspaceChildrenRecursive(rootWorkspace, project)]
}

export const getChangedWorkspaces = async () => {
  const workspaces: Array<Workspace> = await getWorkspaces()
  const changedFiles: Array<string> = await getChangedFiles()

  return workspaces.filter((workspace) =>
    changedFiles.some((changedFile) => changedFile.startsWith(workspace.cwd))
  )
}
