import { getOctokit as createOctokit } from '@actions/github'
import core                            from '@actions/core'

export const getOctokit = () => createOctokit(process.env.GITHUB_TOKEN || core.getInput('token'))
