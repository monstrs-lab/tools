import type { FC }  from 'react'

import { Text }     from 'ink'
import { Box }      from 'ink'
import { nanoid }   from 'nanoid'
import { useMemo }  from 'react'
import React        from 'react'

import { FilePath } from '@monstrs/cli-ui-file-path'

export interface RawOutputProps {
  messages: Array<string>
  file?: string
}

export const RawOutput: FC<RawOutputProps> = ({ file, messages = [] }) => {
  const lines = useMemo(
    () =>
      messages
        .map((message) => (message.endsWith('\n') ? message.replace(/\n$/, '') : message))
        .filter(Boolean),
    [messages]
  )

  return (
    <Box flexDirection='column' borderStyle='single' borderColor='gray' paddingX={2} paddingY={1}>
      {!!file && (
        <Box marginBottom={1}>
          <FilePath>{file}</FilePath>
        </Box>
      )}
      {lines.length > 0 && (
        <Box flexDirection='column' marginBottom={1}>
          {lines.map((line) => (
            <Box key={nanoid()}>
              <Text>{line}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
