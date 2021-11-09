import type { Body } from '@monstrs/logger'

import React         from 'react'
import { Text }      from 'ink'
import { FC }        from 'react'

const getMessage = (body: Body) => {
  if (typeof body === 'string') {
    return body
  }

  if (typeof body.message === 'string') {
    return body.message
  }

  if (body.stack) {
    return ''
  }

  return JSON.stringify(body)
}

export interface MessageProps {
  children: Body
}

export const LogMessage: FC<MessageProps> = ({ children }) => <Text>{getMessage(children)}</Text>
