import type { FC }  from 'react'

import { Text }     from 'ink'
import { Box }      from 'ink'
import { nanoid }   from 'nanoid'
import { useMemo }  from 'react'
import React        from 'react'

import { FilePath } from '@monstrs/cli-ui-file-path'
import { Line }     from '@monstrs/cli-ui-line'

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
    <Box flexDirection='column' borderStyle='single' borderColor='gray'>
      {!!file && (
        <Box marginBottom={1} marginTop={1} marginX={2}>
          <FilePath>{file}</FilePath>
        </Box>
      )}
      {lines.length > 0 && (
        <>
          <Line offset={2} />
          <Box flexDirection='column' marginBottom={1} marginTop={1} marginX={2}>
            {lines.map((line) => (
              <Box key={nanoid()}>
                <Text>{line}</Text>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
