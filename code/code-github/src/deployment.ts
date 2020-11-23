import { context }           from '@actions/github'

import { getOctokit }        from './octokit'
import { getPullRequestSha } from './pull-request'

export const createDeployment = async (options) => {
  const octokit = getOctokit()

  return octokit.repos.createDeployment({
    ref: getPullRequestSha(),
    ...context.repo,
    ...options,
  })
}
