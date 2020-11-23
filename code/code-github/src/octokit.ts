import { GitHub } from '@actions/github/lib/utils'
import { getOctokit as createOctokit } from '@actions/github'

let octokit

export const getOctokit = (): InstanceType<typeof GitHub> => {
  if (!octokit) {
    // @ts-ignore
    octokit = createOctokit(process.env.GITHUB_TOKEN)
  }

  return octokit
}
