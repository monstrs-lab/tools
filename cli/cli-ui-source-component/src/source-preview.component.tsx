import type { FC }         from 'react'

import { Text }            from 'ink'
import React               from 'react'

import { codeFrameSource } from './utils.js'

export interface SourcePreviewProps {
  children: string
  line: number
  column?: number
  message?: string
}

export const SourcePreview: FC<SourcePreviewProps> = ({ children, line, column, message }) => (
  <Text>{codeFrameSource(children, line, column, message)}</Text>
)
