import { Box }        from 'ink'
import { Text }       from 'ink'
import { FC }         from 'react'
import React          from 'react'

import { StackTrace } from '@monstrs/cli-ui-stack-trace-component'

export interface ErrorProps {
  error: Error
}

export const ErrorMessage = ({ children }) => {
  if (!children) {
    return null
  }

  return (
    <Box marginBottom={1}>
      <Text color='red' bold>
        {children}
      </Text>
    </Box>
  )
}

export const ErrorInfo: FC<ErrorProps> = ({ error }) => (
  <Box flexDirection='column'>
    <ErrorMessage>{error.message}</ErrorMessage>
    {error.stack && (
      <Box>
        <StackTrace>{error.stack}</StackTrace>
      </Box>
    )}
  </Box>
)
