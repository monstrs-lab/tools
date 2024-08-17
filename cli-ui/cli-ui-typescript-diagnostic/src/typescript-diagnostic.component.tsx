import type { FC }                      from 'react'
import type { DiagnosticMessageChain }  from 'typescript'
import type { SourceFile }              from 'typescript'

import { isAbsolute }                   from 'node:path'
import { relative }                     from 'node:path'

import { Text }                         from 'ink'
import { Box }                          from 'ink'
import { useMemo }                      from 'react'
import { flattenDiagnosticMessageText } from 'typescript'
import React                            from 'react'

import { FilePath }                     from '@monstrs/cli-ui-file-path'
import { SourcePreview }                from '@monstrs/cli-ui-source-preview'

export interface TypeScriptDiagnosticProps {
  messageText: DiagnosticMessageChain | string
  file?: SourceFile
  start?: number
  code: number
  cwd?: string
}

export const TypeScriptDiagnostic: FC<TypeScriptDiagnosticProps> = ({
  messageText,
  start,
  file,
  code,
  cwd = process.cwd(),
}) => {
  const filePath = useMemo(() => {
    if (!file) {
      return null
    }

    if (isAbsolute(file.fileName)) {
      return relative(cwd, file.fileName)
    }

    return file.fileName
  }, [file])

  const position = useMemo(() => {
    if (file && start) {
      return file.getLineAndCharacterOfPosition(start)
    }

    return null
  }, [file, start])

  return (
    <Box
      flexDirection='column'
      borderStyle='single'
      borderColor='gray'
      paddingX={2}
      paddingY={1}
      width='100%'
    >
      {!!filePath && (
        <Box marginBottom={1}>
          <FilePath line={position?.line ? position.line + 1 : 0} column={position?.character}>
            {filePath}
          </FilePath>
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
