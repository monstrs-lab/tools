import path           from 'path'
import { context }    from '@actions/github'

import { getOctokit } from './octokit'

export const getPullRequestFilesPage = async (page = 0, pullNumber) => {
  const octokit = getOctokit()

  const cwd = process.cwd()

  const { data }: any = await octokit.pulls.listFiles({
    ...context.repo,
    pull_number: pullNumber,
    per_page: 100,
    page,
  })

  return data.map(({ filename }: any) => path.join(cwd, filename))
}

export const getPullRequestFiles = async () => {
  const octokit = getOctokit()
  const event = context.payload

  const pullNumber = process.env.PULL_REQUEST_NUMBER || event.number

  const { data } = await octokit.pulls.get({
    ...context.repo,
    pull_number: pullNumber,
  })

  const pages = Math.ceil(data.changed_files / 100)

  const result = await Promise.all(
    Array(pages)
      .fill(null)
      .map((_, page) => getPullRequestFilesPage(page, pullNumber))
  )

  return result.flat()
}

export const getPullRequestSha = (): string => {
  const event = context.payload

  return event.after || event.pull_request?.head?.sha || process.env.GITHUB_SHA
}
