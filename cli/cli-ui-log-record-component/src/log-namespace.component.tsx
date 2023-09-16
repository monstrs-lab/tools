import type { LogAttributeValue } from '@monstrs/logger'
import type { AttributeValue }    from '@monstrs/logger'
import type { FC }                from 'react'

import { Text }                   from 'ink'
import { nanoid }                 from 'nanoid'
import { useMemo }                from 'react'
import React                      from 'react'
import decamelize                 from 'decamelize'
import uniqolor                   from 'uniqolor'

export interface NamespaceProps {
  children?: LogAttributeValue
}

export const LogNamespace: FC<NamespaceProps> = ({ children }) => {
  const value: LogAttributeValue | undefined = useMemo(() => {
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

  if (Array.isArray(value)) {
    return value.map((val) => (
      <Text key={nanoid()} color={color}>
        {val}
      </Text>
    ))
  }

  return <Text color={color}>{value as AttributeValue}</Text>
}
