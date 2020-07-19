import { getInput }                    from '@actions/core'
import { getOctokit as createOctokit } from '@actions/github'

let octokit = null

export const getOctokit = () => {
  if (!octokit) {
    octokit = createOctokit(getInput('github-token', { required: true }))
  }

  return octokit
}
