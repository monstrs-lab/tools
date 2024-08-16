import type { StackFrame } from '@monstrs/stack-trace'
import type { FC }         from 'react'

import { parse }           from '@monstrs/stack-trace'
import { Text }            from 'ink'
import { Box }             from 'ink'
import { nanoid }          from 'nanoid'
import { useMemo }         from 'react'
import React               from 'react'

import { FilePath }        from '@monstrs/cli-ui-file-path-component'
import { SourcePreview }   from '@monstrs/cli-ui-source-component'

import { getFrameSource }  from './utils.js'

export interface StackTraceProps {
  children: string
  cwd?: string
}

export const StackTrace: FC<StackTraceProps> = ({ children, cwd }) => {
  const stack = useMemo(() => parse(children), [children])
  const topFrame = useMemo(() => stack.topFrame || stack.frames.at(0), [stack])
  const source = useMemo(() => (topFrame ? getFrameSource(topFrame) : null), [topFrame])

  if (!stack) {
    return null
  }

  return (
    <Box flexDirection='column' flexGrow={1}>
      {!!source && !!stack.topFrame?.line && (
        <Box marginBottom={1}>
          <SourcePreview line={stack.topFrame.line} column={stack.topFrame.column}>
            {source}
          </SourcePreview>
        </Box>
      )}
      {stack.frames.map((frame: StackFrame) => (
        <Box key={nanoid()} flexDirection='row'>
          <Box flexBasis='30%'>
            <Text>{frame.function}</Text>
          </Box>
          <Box flexBasis='70%' justifyContent='flex-end'>
            {!!frame.file && (
              <FilePath cwd={cwd} url={frame.file} line={frame.line} column={frame.column} />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

/*
<Text color='gray'>
              {frame.file ? relative(process.cwd(), frame.file) : frame.file}
            </Text>
            {!!frame.line && <Text color='gray'>:{frame.line}</Text>}
            {!!frame.column && <Text color='gray'>:{frame.column}</Text>}
            */
