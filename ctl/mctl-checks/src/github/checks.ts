import { GitHub, context } from '@actions/github'

export const createOctokit = () => new GitHub(process.env.GITHUB_TOKEN as any)

export const getEvent = () =>
  process.env.GITHUB_EVENT_PATH ? require(process.env.GITHUB_EVENT_PATH) : {} // eslint-disable-line

export const createCheck = async (name: string, conclusion: string, output: any) => {
  const event = getEvent()
  const octokit = createOctokit()

  const params: any = {
    ...context.repo,
    name,
    head_sha: event.after || event.pull_request.head.sha || (process.env.GITHUB_SHA as any),
    status: 'completed',
    completed_at: new Date().toISOString(),
    conclusion,
    output,
  }

  try {
    await octokit.checks.create(params)
  } catch (error) {
    console.log(error) // eslint-disable-line
  }
}

export const getPullCommitsMessages = async () => {
  const event = getEvent()
  const octokit = createOctokit()

  const { data }: any = await octokit.pulls.listCommits({
    ...context.repo,
    pull_number: event.number,
  })

  return data.map(({ commit }: any) => commit.message)
}
