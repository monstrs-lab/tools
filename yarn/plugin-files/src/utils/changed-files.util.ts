import type { Endpoints } from '@octokit/types'
import type { Project }   from '@yarnpkg/core'

import { context }        from '@actions/github'
import { getOctokit }     from '@actions/github'
import { execUtils }      from '@yarnpkg/core'

type GetCommitResponseData = Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']
type GetCommitsResponseData = Endpoints['GET /repos/{owner}/{repo}/commits']['response']['data']

export const getPullRequestCommits = async (): Promise<GetCommitsResponseData> => {
  if (context.eventName === 'pull_request' && context.payload.pull_request) {
    const url: string = context.payload.pull_request.commits_url

    return getOctokit(process.env.GITHUB_TOKEN!).paginate(`GET ${url}`, context.repo)
  }

  // eslint-disable-next-line no-console
  console.log(`Unknown event "${context.eventName}". Only "push" and "pull_request" supported.`)

  return []
}

export const getCommitData = async (ref: string): Promise<GetCommitResponseData> => {
  const commit = await getOctokit(process.env.GITHUB_TOKEN!).rest.repos.getCommit({
    ...context.repo,
    ref,
  })

  return commit as GetCommitResponseData
}

export const getChangedCommmits = async (): Promise<Array<GetCommitResponseData>> => {
  const eventCommits =
    context.eventName === 'push' ? context.payload.commits : await getPullRequestCommits()

  return Promise.all(eventCommits.map(async (commit) => getCommitData(commit.id || commit.sha)))
}

export const getGithubChangedFiles = async (): Promise<Array<string>> => {
  const commits = await getChangedCommmits()

  return commits
    .map((commit) => {
      if (!commit.data.files) {
        return []
      }

      return commit.data.files.map((file) => file.filename).filter(Boolean)
    })
    .flat()
}

export const getChangedFiles = async (
  project: Project,
  gitRange?: string
): Promise<Array<string>> => {
  if (process.env.GITHUB_EVENT_PATH && process.env.GITHUB_TOKEN) {
    return getGithubChangedFiles()
  }

  const { stdout } = await execUtils.execvp(
    'git',
    ['diff', '--name-only', ...(gitRange ? [gitRange] : [])],
    {
      cwd: project.cwd,
      strict: true,
    }
  )

  return stdout.split(/\r?\n/).filter(Boolean)
}
