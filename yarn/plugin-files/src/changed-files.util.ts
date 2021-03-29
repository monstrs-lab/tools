import { getChangedFiles as getGithubChangedFiles } from '@monstrs/github-actions-utils'
import { isGithubActionsEnv }                       from '@monstrs/github-actions-utils'
import { Project }                                  from '@yarnpkg/core'
import { execUtils }                                from '@yarnpkg/core'

export const getChangedFiles = async (project: Project, gitRange?: string) => {
  if (isGithubActionsEnv()) {
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
