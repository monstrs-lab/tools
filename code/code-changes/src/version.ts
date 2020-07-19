import execa                              from 'execa'

import { IsGithubEnv, getPullRequestSha } from '@monstrs/code-github'

import { getChangedFiles }                from './changed-files'

export const NEXT_VERSION = 'next'

export const getVersion = async (): Promise<string> => {
  if (IsGithubEnv()) {
    return getPullRequestSha()
  }

  const changes = await getChangedFiles()

  if (changes && changes.length > 0) {
    return NEXT_VERSION
  }

  const { stdout } = await execa('git', ['log', '-1', '--format="%H"'])

  return stdout
}
