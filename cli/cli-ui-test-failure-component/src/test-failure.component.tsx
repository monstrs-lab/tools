import type { ReactElement } from 'react'

import { Text }              from 'ink'
import { Box }               from 'ink'
import React                 from 'react'

import { SourcePreview }     from '@monstrs/cli-ui-source-component'

export interface TestFailureProps {
  details: {
    error: Error
  }
  source?: string
  file?: string
  column?: number
  line?: number
}

export const TestFailure = ({
  source,
  file,
  column,
  line,
  details,
}: TestFailureProps): ReactElement => {
  if (!(file && source)) {
    return (
      <Box>
        <Text>{details.error.message}</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection='column' borderStyle='single' borderColor='gray' paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color='cyan'>
          {file}
          <Text color='yellow'>
            :{line ?? 1}:{column ?? 1}
          </Text>
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color='white'>{details.error.message}</Text>
      </Box>
      <Box marginBottom={1}>
        <SourcePreview line={line ?? 1} column={column ?? 1}>
          {source}
        </SourcePreview>
      </Box>
    </Box>
  )
}
