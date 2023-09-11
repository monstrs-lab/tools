import type { LogAttributeValue } from '@monstrs/logger'
import type { FC }                from 'react'

import { Box }                    from 'ink'
import React                      from 'react'

import { StackTrace }             from '@monstrs/cli-ui-stack-trace-component'

export interface LogStackTraceProps {
  children?: LogAttributeValue | string
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
