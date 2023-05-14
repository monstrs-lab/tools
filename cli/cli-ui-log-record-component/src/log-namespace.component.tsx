import type { AttributeValue } from '@monstrs/logger'
import type { FC }             from 'react'

import { Text }                from 'ink'
import { useMemo }             from 'react'
import React                   from 'react'
import uniqolor                from 'uniqolor'
import decamelize              from 'decamelize'

export interface NamespaceProps {
  children?: AttributeValue
}

export const LogNamespace: FC<NamespaceProps> = ({ children }) => {
  const value = useMemo(() => {
    if (typeof children === 'string') {
      return decamelize(children, { separator: '-' })
    }

    return children
  }, [children])

  const color = useMemo(() => {
    if (value && typeof value === 'string') {
      return uniqolor(value.split(':').at(0)!).color
    }

    return '#d75f00'
  }, [value])

  if (!value) {
    return null
  }

  return <Text color={color}>{value}</Text>
}
