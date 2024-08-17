import type { ReactElement } from 'react'

import { Text }              from 'ink'
import { Box }               from 'ink'
import React                 from 'react'

import { FilePath }          from '@monstrs/cli-ui-file-path'
import { SourcePreview }     from '@monstrs/cli-ui-source-preview'

export interface TestFailureProps {
  details: {
    error: Error
  }
  source?: string
  file?: string
  line?: number
  column?: number
}

export const TestFailure = ({
  details,
  source,
  file,
  line,
  column,
}: TestFailureProps): ReactElement => {
  if (!(file && source)) {
    return (
      <Box
        flexDirection='column'
        borderStyle='single'
        borderColor='gray'
        paddingX={2}
        paddingY={1}
        width='100%'
      >
        <Text>{details.error.message}</Text>
      </Box>
    )
  }

  return (
    <Box
      flexDirection='column'
      borderStyle='single'
      borderColor='gray'
      paddingX={2}
      paddingY={1}
      width='100%'
    >
      <Box marginBottom={1}>
        <FilePath line={line} column={column}>
          {file}
        </FilePath>
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
