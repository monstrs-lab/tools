import React                     from 'react'
import { UncontrolledTextInput } from 'ink-text-input'
import { Text }                  from 'ink'
import { Box }                   from 'ink'
import figures                   from 'figures'

export const RequestCommitMessageIssues = ({ onSubmit }) => (
  <Box flexDirection='column'>
    <Box>
      <Text bold color='cyanBright'>
        Add issue references (e.g. "fix #123, re #124".):
      </Text>
    </Box>
    <Box>
      <Box marginRight={1}>
        <Text color='gray'>{figures.arrowRight}</Text>
      </Box>
      <Box>
        <UncontrolledTextInput onSubmit={onSubmit} />
      </Box>
    </Box>
  </Box>
)
