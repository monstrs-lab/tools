import type { ReactElement } from 'react'

import { Text }              from 'ink'
import { Box }               from 'ink'
import React                 from 'react'

import { FilePath }          from '@monstrs/cli-ui-file-path'
import { SourcePreview }     from '@monstrs/cli-ui-source-preview'

export interface LintResultMessageProps {
  ruleId: string | null
  message: string
  line: number
  column: number
}

export interface LintResultMessageElProp {
  message: LintResultMessageProps
  filePath: string
  source?: string
}

export const LintResultMessage = ({
  filePath,
  message,
  source,
}: LintResultMessageElProp): ReactElement => (
  <Box
    flexDirection='column'
    borderStyle='single'
    borderColor='gray'
    paddingX={2}
    paddingY={1}
    width='100%'
  >
    <Box marginBottom={1}>
      <FilePath line={message.line} column={message.column}>
        {filePath}
      </FilePath>
    </Box>
    <Box marginBottom={1} marginLeft={2}>
      <Text bold color='red'>
        Error
      </Text>
      <Text color='white'>: {message.message}</Text>
      <Text color='gray'> {message.ruleId}</Text>
    </Box>
    {!!source && (
      <Box marginBottom={1}>
        <SourcePreview line={message.line} column={message.column}>
          {source}
        </SourcePreview>
      </Box>
    )}
  </Box>
)
