import React    from 'react'

import { Cell } from './cell.component'

const colors = {
  TRACE: 'gray',
  DEBUG: 'gray',
  INFO: 'blue',
  WARN: 'yellow',
  ERROR: 'red',
  FATAL: 'red',
}

export const Severity = ({ children, ...props }) => (
  <Cell {...props} color={colors[children]}>
    {children}
  </Cell>
)
