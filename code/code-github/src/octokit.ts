import core                                from '@actions/core'
import { getOctokit as getActionsOctokit } from '@actions/github'

let octokit = null

export const getOctokit = () => {
  if (!octokit) {
    octokit = getActionsOctokit(core.getInput('github-token', { required: true }))
  }

  return octokit
}
