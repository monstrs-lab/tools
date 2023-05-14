import type { FC }                      from 'react'
import type { PortablePath }            from '@yarnpkg/fslib'
import type { SubmitInjectedComponent } from '@yarnpkg/libui/sources/misc/renderForm.js'
import type { CommitProperties }        from '@monstrs/cli-ui-git-commit-component'

import { BaseCommand }                  from '@yarnpkg/cli'
import { xfs }                          from '@yarnpkg/fslib'
import { renderForm }                   from '@yarnpkg/libui/sources/misc/renderForm.js'
import { Option }                       from 'clipanion'
import { forceStdinTty }                from 'force-stdin-tty'
import { useStdin }                     from 'ink'
import { useEffect }                    from 'react'
import { useState }                     from 'react'
import React                            from 'react'
import wrap                             from 'word-wrap'

import { RequestCommitMessage }         from '@monstrs/cli-ui-git-commit-component'

const RequestCommitMessageSubmit: FC<SubmitInjectedComponent<{ commit: string }>> = ({
  commit,
  useSubmit,
}) => {
  const { stdin } = useStdin()

  useSubmit(commit)

  useEffect(() => {
    stdin?.emit('keypress', '', { name: 'return' })
  }, [stdin])

  return null
}

const RequestCommitMessageApp: FC<SubmitInjectedComponent<CommitProperties>> = ({ useSubmit }) => {
  const [commit, setCommit] = useState()

  if (!commit) {
    return <RequestCommitMessage onSubmit={setCommit} />
  }

  return <RequestCommitMessageSubmit commit={commit} useSubmit={useSubmit} />
}

export class CommitMessageCommand extends BaseCommand {
  static paths = [['commit', 'message']]

  args: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    const [commitMessageFile, source] = this.args

    if (source) {
      return 0
    }

    if (!commitMessageFile) {
      throw new Error('Commit edit message file required.')
    }

    const overwroteStdin = forceStdinTty()

    const commit: CommitProperties | undefined = await renderForm(
      RequestCommitMessageApp,
      {},
      {
        stdin: process.stdin,
        stdout: this.context.stdout,
        stderr: this.context.stderr,
      }
    )

    if (commit) {
      await xfs.writeFilePromise(commitMessageFile as PortablePath, this.formatCommit(commit))
    }

    if (overwroteStdin) {
      process.stdin.destroy()
    }

    return commit ? 0 : 1
  }

  private formatCommit(commit: CommitProperties) {
    const wrapOptions = {
      trim: true,
      cut: false,
      newline: '\n',
      indent: '',
      width: 100,
    }

    let head = `${commit.type}${commit.scope ? `(${commit.scope})` : ''}: ${commit.subject}`

    if (commit.skipci) {
      head += ' [skip ci]'
    }

    const body = commit.body ? wrap(commit.body, wrapOptions) : false

    const breaking = commit.breaking
      ? wrap(
          `BREAKING CHANGE: ${commit.breaking.trim().replace(/^BREAKING CHANGE: /, '')}`,
          wrapOptions
        )
      : false

    const issues = commit.issues ? wrap(commit.issues, wrapOptions) : false

    return [head, body, breaking, issues].filter(Boolean).join('\n\n')
  }
}
