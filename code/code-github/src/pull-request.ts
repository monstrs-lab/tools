import path           from 'path'
import { context }    from '@actions/github'

import { getOctokit } from './octokit'

export const getPullRequestFiles = async () => {
  const octokit = getOctokit()
  const event = context.payload

  const cwd = process.cwd()

  const { data }: any = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: event.number,
  })

  return data.map(({ filename }: any) => path.join(cwd, filename))
}

export const getPullRequestSha = (): string => {
  const event = context.payload

  return event.after || event.pull_request.head.sha || process.env.GITHUB_SHA
}
