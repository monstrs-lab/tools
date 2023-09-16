import type { FC }                       from 'react'
import type { DiagnosticMessageChain }   from 'typescript'
import type { SourceFile }               from 'typescript'

import { isAbsolute }                    from 'node:path'
import { relative }                      from 'node:path'

import { Text }                          from 'ink'
import { Box }                           from 'ink'
import { useMemo }                       from 'react'
import React                             from 'react'

import { SourcePreview }                 from '@monstrs/cli-ui-source-component'
import { getLineAndCharacterOfPosition } from '@monstrs/code-typescript'
import { flattenDiagnosticMessageText }  from '@monstrs/code-typescript'

export interface TypeScriptDiagnosticProps {
  file?: SourceFile
  messageText: DiagnosticMessageChain | string
  start?: number
  code: number
}

export const TypeScriptDiagnostic: FC<TypeScriptDiagnosticProps> = ({
  start,
  file,
  messageText,
  code,
}) => {
  const filepath = useMemo(() => {
    if (!file) {
      return null
    }

    if (isAbsolute(file.fileName)) {
      return relative(process.cwd(), file?.fileName)
    }

    return file.fileName
  }, [file])

  const position = useMemo(() => {
    if ((file as any)?.lineMap && start) {
      return getLineAndCharacterOfPosition(file, start)
    }

    return null
  }, [file, start])

  return (
    <Box flexDirection='column' marginBottom={1}>
      {!!filepath && (
        <Box marginBottom={1}>
          <Text color='cyan'>
            {filepath}
            {!!position && (
              <Text color='yellow'>
                :{position.line + 1}:{position.character}
              </Text>
            )}
          </Text>
        </Box>
      )}
      <Box marginBottom={1}>
        <Text bold color='red'>
          TS{code}
        </Text>
        <Text color='white'>: {flattenDiagnosticMessageText(messageText, '\n')}</Text>
      </Box>
      {!!file?.text && !!position && (
        <Box marginBottom={1}>
          <SourcePreview line={position.line + 1} column={position.character}>
            {file.text}
          </SourcePreview>
        </Box>
      )}
    </Box>
  )
}
