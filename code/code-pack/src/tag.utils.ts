import type { PortablePath } from '@yarnpkg/fslib'

import type { TagPolicy }    from './pack.interfaces.js'

import { context }           from '@actions/github'
import { execUtils }         from '@yarnpkg/core'

export const getPullRequestSha = (): string => {
  const event = context.payload

  return (
    process.env.GITHUB_PULL_REQUST_HEAD_SHA ||
    event.after ||
    event.pull_request?.head?.sha ||
    process.env.GITHUB_SHA
  )
}

export const getPullRequestId = (): string => {
  const event = context.payload

  return event.pull_request?.id
}

export const getPullRequestNumber = (): string => {
  const event = context.payload

  return String(event.pull_request?.number)
}

export const getRevision = async (): Promise<string> => {
  if (process.env.GITHUB_EVENT_PATH && process.env.GITHUB_TOKEN) {
    return getPullRequestSha()
  }

  const { stdout } = await execUtils.execvp('git', ['log', '-1', '--format="%H"'], {
    cwd: process.cwd() as PortablePath,
    strict: true,
  })

  const [revision] = stdout.split('\n')

  return revision.replace(/"/g, '')
}

export const getContext = async (): Promise<string> => {
  if (process.env.GITHUB_EVENT_PATH && process.env.GITHUB_TOKEN) {
    return getPullRequestNumber()
  }

  return 'local'
}

export const getTag = async (tagPolicy: TagPolicy): Promise<string> => {
  const revision = await getRevision()
  const hash = revision.substr(0, 7)

  if (tagPolicy === 'hash-timestamp') {
    return `${hash}-${Date.now()}`
  }

  if (tagPolicy === 'ctx-hash-timestamp') {
    const ctx = await getContext()

    return `${ctx}-${hash}-${Date.now()}`
  }

  return revision
}
