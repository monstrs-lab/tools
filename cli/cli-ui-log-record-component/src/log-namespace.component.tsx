import type { AttributeValue } from '@monstrs/logger'

import { Text }                from 'ink'
import { FC }                  from 'react'
import React                   from 'react'

export interface NamespaceProps {
  children?: AttributeValue
}

export const LogNamespace: FC<NamespaceProps> = ({ children }) => {
  if (!children) {
    return null
  }

  return <Text color='#d75f00'>{children}</Text>
}
