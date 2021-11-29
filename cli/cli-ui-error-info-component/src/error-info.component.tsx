import React          from 'react'
import { Box }        from 'ink'
import { Text }       from 'ink'
import { FC }         from 'react'

import { StackTrace } from '@monstrs/cli-ui-stack-trace-component'

export interface ErrorProps {
  error: Error
}

export const ErrorInfo: FC<ErrorProps> = ({ error }) => (
  <Box flexDirection='column'>
    {error.message && (
      <Box marginBottom={1}>
        <Text color='red' bold>
          {error.message}
        </Text>
      </Box>
    )}
    {error.stack && (
      <Box>
        <StackTrace>{error.stack}</StackTrace>
      </Box>
    )}
  </Box>
)
