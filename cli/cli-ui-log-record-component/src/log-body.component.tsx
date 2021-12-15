import type { Body }  from '@monstrs/logger'

import React          from 'react'
import { Box }        from 'ink'
import { FC }         from 'react'

import { StackTrace } from '@monstrs/cli-ui-stack-trace-component'

export interface BodyProps {
  children: Body
}

export const LogBody: FC<BodyProps> = ({ children }) => {
  if (typeof children === 'string') {
    return null
  }

  if (children.stack) {
    return (
      <Box>
        <StackTrace>{children.stack}</StackTrace>
      </Box>
    )
  }

  return null
}
