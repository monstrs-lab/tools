import { execUtils }          from '@yarnpkg/core'
import { PortablePath }       from '@yarnpkg/fslib'

import { isGithubActionsEnv } from '@monstrs/github-actions-utils'
import { getPullRequestSha }  from '@monstrs/github-actions-utils'

import { TagPolicy }          from './pack.interfaces'

export const getRevision = async () => {
  if (isGithubActionsEnv()) {
    return getPullRequestSha()
  }

  const { stdout } = await execUtils.execvp('git', ['log', '-1', '--format="%H"'], {
    cwd: process.cwd() as PortablePath,
    strict: true,
  })

  const [revision] = stdout.split('\n')

  return revision.replace(/"/g, '')
}

export const getTag = async (tagPolicy: TagPolicy) => {
  const revision = await getRevision()
  const hash = revision.substr(0, 7)

  if (tagPolicy === 'hash-timestamp') {
    return `${hash}-${Date.now()}`
  }

  return revision
}
