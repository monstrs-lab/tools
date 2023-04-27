import { Text } from 'ink'
import { FC }   from 'react'
import React    from 'react'

export interface MessageProps {
  children?: string
}

export const LogMessage: FC<MessageProps> = ({ children }) => {
  if (!children) {
    return null
  }

  return <Text>{children}</Text>
}
