import type { FC }                        from 'react'

import type { AdditionalProperties }      from './request-commit-message-additional.component.jsx'

import { useEffect }                      from 'react'
import { useState }                       from 'react'
import React                              from 'react'

import { RequestCommitMessageAdditional } from './request-commit-message-additional.component.jsx'
import { RequestCommitMessageBody }       from './request-commit-message-body.component.jsx'
import { RequestCommitMessageBreaking }   from './request-commit-message-breaking.component.jsx'
import { RequestCommitMessageIssues }     from './request-commit-message-issues.component.jsx'
import { RequestCommitMessageScope }      from './request-commit-message-scope.component.jsx'
import { RequestCommitMessageSubject }    from './request-commit-message-subject.component.jsx'
import { RequestCommitMessageType }       from './request-commit-message-type.component.jsx'

export interface CommitProperties {
  type: string
  subject: string
  scope?: string
  body?: string
  breaking?: string
  issues?: string
  skipci?: boolean
}

interface SubmitProps extends CommitProperties {
  onSubmit: (value: CommitProperties) => void
}

const Submit: FC<SubmitProps> = ({ onSubmit, ...props }): null => {
  useEffect(() => {
    onSubmit(props)
  }, [props, onSubmit])

  return null
}

interface RequestCommitMessageProps {
  onSubmit: (props: CommitProperties) => void
}

export const RequestCommitMessage: FC<RequestCommitMessageProps> = ({ onSubmit }) => {
  const [type, setType] = useState<string | undefined>()
  const [scope, setScope] = useState<string | undefined>()
  const [subject, setSubject] = useState<string | undefined>()
  const [issues, setIssues] = useState<string | undefined>()
  const [body, setBody] = useState<string | undefined>()
  const [breaking, setBreaking] = useState<string | undefined>()
  const [additional, setAdditional] = useState<AdditionalProperties>()

  if (!type) {
    return <RequestCommitMessageType onSubmit={setType} />
  }

  if (!subject) {
    return <RequestCommitMessageSubject onSubmit={setSubject} />
  }

  if (!additional) {
    return <RequestCommitMessageAdditional onSubmit={setAdditional} />
  }

  if (additional.scope && !scope) {
    return <RequestCommitMessageScope onSubmit={setScope} />
  }

  if (additional.issues && !issues) {
    return <RequestCommitMessageIssues onSubmit={setIssues} />
  }

  if (additional.body && !body) {
    return <RequestCommitMessageBody onSubmit={setBody} />
  }

  if (additional.breaking && !breaking) {
    return <RequestCommitMessageBreaking onSubmit={setBreaking} />
  }

  return (
    <Submit
      type={type}
      scope={scope}
      subject={subject}
      issues={issues}
      body={body}
      breaking={breaking}
      skipci={additional.skipci}
      onSubmit={onSubmit}
    />
  )
}
