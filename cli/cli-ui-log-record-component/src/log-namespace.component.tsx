import React    from 'react'
import toColor  from 'string-to-color'
import { Text } from 'ink'
import { FC }   from 'react'

const color = (name) => {
  const parts = name.split(':')

  return toColor(parts.length > 1 ? parts[0] : name)
}

export interface NamespaceProps {
  children: string
}

export const LogNamespace: FC<NamespaceProps> = ({ children }) => (
  <Text color={color(children)}>[{children}]</Text>
)
