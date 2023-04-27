import type { AttributeValue } from '@monstrs/logger'

import { Box }                 from 'ink'
import { FC }                  from 'react'
import React                   from 'react'

import { StackTrace }          from '@monstrs/cli-ui-stack-trace-component'

export interface LogStackTraceProps {
  children?: string | AttributeValue
}

export const LogStackTrace: FC<LogStackTraceProps> = ({ children }) => {
  if (!children) {
    return null
  }

  return (
    <Box paddingBottom={1}>
      <StackTrace>{children as string}</StackTrace>
    </Box>
  )
}
