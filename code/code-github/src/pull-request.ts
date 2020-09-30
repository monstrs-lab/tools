import path           from 'path'
import { context }    from '@actions/github'

import { getOctokit } from './octokit'

export const getPullRequestFilesPage = async (page = 0) => {
  const octokit = getOctokit()
  const event = context.payload

  const cwd = process.cwd()

  const { data }: any = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: event.number,
    per_page: 100,
    page,
  })

  return data.map(({ filename }: any) => path.join(cwd, filename))
}

export const getPullRequestFiles = async () => {
  const octokit = getOctokit()
  const event = context.payload

  const { data } = await octokit.pulls.get({
    ...context.repo,
    pull_number: event.number,
  })

  const pages = Math.ceil(data.changed_files / 100)

  const result = await Promise.all(
    Array(pages)
      .fill(null)
      .map((_, page) => getPullRequestFilesPage(page))
  )

  return result.flat()
}

export const getPullRequestSha = (): string => {
  const event = context.payload

  return event.after || event.pull_request?.head?.sha || process.env.GITHUB_SHA
}
