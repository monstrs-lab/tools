import type { FC } from 'react'

import { Text }    from 'ink'
import { Box }     from 'ink'
import { nanoid }  from 'nanoid'
import { useMemo } from 'react'
import React       from 'react'

export interface StdOutputProps {
  file?: string
  messages: Array<string>
}

export const StdOutput: FC<StdOutputProps> = ({ file, messages = [] }) => {
  const lines = useMemo(
    () =>
      messages
        .map((message) => (message.endsWith('\n') ? message.replace(/\n$/, '') : message))
        .filter(Boolean),
    [messages]
  )

  return (
    <Box flexDirection='column' borderStyle='single' borderColor='gray' paddingX={2} paddingY={1}>
      <Box marginBottom={1}>
        <Text color='cyan'>{file}</Text>
      </Box>
      <Box flexDirection='column' marginBottom={1}>
        {lines.map((line) => (
          <Box key={nanoid()}>
            <Text>{line}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
