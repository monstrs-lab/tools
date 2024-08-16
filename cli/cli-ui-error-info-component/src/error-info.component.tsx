import type { FC }    from 'react'

import { Box }        from 'ink'
import { Text }       from 'ink'
import React          from 'react'

import { StackTrace } from '@monstrs/cli-ui-stack-trace-component'

export interface ErrorProps {
  error: Error
  cwd?: string
}

export interface ErrorMessageProps {
  children?: string
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ children }) => {
  if (!children) {
    return null
  }

  return (
    <Box marginBottom={1}>
      <Text bold color='red'>
        {children}
      </Text>
    </Box>
  )
}

export const ErrorInfo: FC<ErrorProps> = ({ error, cwd }) => (
  <Box flexDirection='column' borderStyle='single' borderColor='gray' paddingX={2} paddingY={1}>
    <ErrorMessage>{error.message}</ErrorMessage>
    {!!error.stack && (
      <Box>
        <StackTrace cwd={cwd}>{error.stack}</StackTrace>
      </Box>
    )}
  </Box>
)
