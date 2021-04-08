import { context } from '@actions/github'

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
