import React          from 'react'
import { FC }         from 'react'
import { Box }        from 'ink'
import { Body }       from '@monstrs/logger'

import { StackTrace } from '../stack-trace'

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