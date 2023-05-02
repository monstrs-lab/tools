import type { AttributeValue } from '@monstrs/logger'

import { Text }                from 'ink'
import { FC }                  from 'react'
import { useMemo }             from 'react'
import React                   from 'react'
import toColor                 from 'string-to-color'
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
      return toColor(value.split(':').at(0))
    }

    return '#d75f00'
  }, [value])

  if (!value) {
    return null
  }

  return <Text color={color}>{value}</Text>
}
