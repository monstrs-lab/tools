import { isAbsolute }                    from 'node:path'
import { relative }                      from 'node:path'

import React                             from 'react'
import { Text }                          from 'ink'
import { Box }                           from 'ink'
import { Spacer }                        from 'ink'
import { Newline }                       from 'ink'
import { FC }                            from 'react'
import type { DiagnosticMessageChain }   from 'typescript'
import type { SourceFile }               from 'typescript'
import { useMemo }                       from 'react'

import { SourcePreview }                 from '@monstrs/cli-ui-source-component'

import { getLineAndCharacterOfPosition } from './utils'
import { flattenDiagnosticMessageText }  from './utils'

export interface TypeScriptDiagnosticProps {
  file?: SourceFile | any
  messageText: string | DiagnosticMessageChain
  start?: number
}

export const TypeScriptDiagnostic: FC<TypeScriptDiagnosticProps> = ({
  start,
  file,
  messageText,
}) => {
  const filepath = useMemo(() => {
    if (!file) {
      return null
    }

    if (isAbsolute(file.fileName)) {
      return relative(process.cwd(), file?.fileName)
    }

    return file.fileName
  }, [file?.fileName])

  if (!(file && start)) {
    return (
      <Box flexDirection='column'>
        <Box marginBottom={1}>
          <Text color='cyan'>{filepath}</Text>
        </Box>
        <Box marginBottom={1} marginLeft={2}>
          <Text bold color='red'>
            Error
          </Text>
          <Text color='white'>: {flattenDiagnosticMessageText(messageText, '\n')}</Text>
        </Box>
      </Box>
    )
  }

  const position = getLineAndCharacterOfPosition(file, start)

  return (
    <Box flexDirection='column' marginBottom={1}>
      {filepath && (
        <Box marginBottom={1}>
          <Text color='cyan'>
            {filepath}
            <Text color='yellow'>
              :{position.line + 1}:{position.character}
            </Text>
          </Text>
        </Box>
      )}
      <Box marginBottom={1} marginLeft={2}>
        <Text bold color='red'>
          Error
        </Text>
        <Text color='white'>: {flattenDiagnosticMessageText(messageText, '\n')}</Text>
      </Box>
      {file.text && (
        <Box marginBottom={1}>
          <SourcePreview line={position.line + 1} column={position.character}>
            {file.text}
          </SourcePreview>
        </Box>
      )}
    </Box>
  )
}
