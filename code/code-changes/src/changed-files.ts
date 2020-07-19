import execa                                from 'execa'
import path                                 from 'path'

import { IsGithubEnv, getPullRequestFiles } from '@monstrs/code-github'

export const getLocalChangedFiles = async (): Promise<Array<string>> => {
  const cwd = process.cwd()

  const { stdout } = await execa('git', ['ls-files', '-dm'])

  return stdout.split('\n').map((filename) => path.join(cwd, filename))
}

export const getChangedFiles = async (): Promise<Array<string>> => {
  if (IsGithubEnv()) {
    return getPullRequestFiles()
  }

  return getLocalChangedFiles()
}
