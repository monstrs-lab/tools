import React                     from 'react'
import { useState }              from 'react'
import { useMemo }               from 'react'
import Select                    from 'ink-select-input'
import { UncontrolledTextInput } from 'ink-text-input'
import { Text }                  from 'ink'
import { Box }                   from 'ink'
import { Spacer }                from 'ink'

export const RequestCommitMessageSubject = ({ onSubmit }) => (
  <Box flexDirection='column'>
    <Box>
      <Text bold color='cyanBright'>
        Write a short description (max 93) chars):
      </Text>
    </Box>
    <Box>
      <Box marginRight={1}>
        <Text color='gray'>→</Text>
      </Box>
      <Box>
        <UncontrolledTextInput onSubmit={onSubmit} />
      </Box>
    </Box>
  </Box>
)
