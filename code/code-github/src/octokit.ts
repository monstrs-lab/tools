import { getOctokit as createOctokit } from '@actions/github'

let octokit = null

export const getOctokit = () => {
  if (!octokit) {
    octokit = createOctokit(process.env.GITHUB_TOKEN)
  }

  return octokit
}
