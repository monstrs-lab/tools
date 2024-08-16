import type { FC }                       from 'react'

import type { ESLintResultMessageProps } from './eslint-result-message.component.jsx'

import { isAbsolute }                    from 'node:path'
import { relative }                      from 'node:path'

import { Box }                           from 'ink'
import { nanoid }                        from 'nanoid'
import { useMemo }                       from 'react'
import React                             from 'react'

import { ESLintResultMessage }           from './eslint-result-message.component.jsx'

export interface ESLintResultProps {
  messages: Array<ESLintResultMessageProps>
  filePath: string
  source?: string
  cwd?: string
}

export const ESLintResult: FC<ESLintResultProps> = ({
  filePath,
  source,
  messages,
  cwd = process.cwd(),
}) => {
  const filepath = useMemo(() => {
    if (isAbsolute(filePath)) {
      return relative(cwd, filePath)
    }

    return filePath
  }, [filePath])

  if (messages.length === 0) {
    return null
  }

  return (
    <Box flexDirection='column' width='100%'>
      {messages.map((message) => (
        <ESLintResultMessage key={nanoid()} filePath={filepath} message={message} source={source} />
      ))}
    </Box>
  )
}
