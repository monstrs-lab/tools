/* eslint-disable no-else-return */

import React    from 'react'

import { Cell } from './cell.component'

const content = (body) => {
  if (!body) {
    return ''
  } else if (typeof body === 'string') {
    return body
  } else if (body.message && typeof body.message === 'string') {
    return body.message
  }

  return JSON.stringify(body)
}

export const Body = ({ children, ...props }) => <Cell {...props}>{content(children)}</Cell>
