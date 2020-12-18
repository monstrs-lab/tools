/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-array-index-key */

import React         from 'react'
import { Component } from 'react'
import { Line }      from './line.component'

const containerOptions = {
  ref: 'table',
  mouse: false,
  width: '100%',
}

export interface ListProps {
  data: any
  locked: boolean
  selectedNo: number
  height: number
  onKeypress: (char: any, key: any) => void
}

export class List extends Component<ListProps> {
  render() {
    const { height, locked, data, selectedNo, onKeypress } = this.props

    return (
      <blessed-box
        keys={!locked}
        height={height + 3}
        scrollable={!locked}
        onKeypress={onKeypress}
        focused={!locked}
        {...containerOptions}
      >
        <blessed-box height='100%-4' width='100%'>
          {data.map((record, index) => (
            <Line
              key={`styled-request-${index}`}
              top={index}
              index={index}
              selectedIndex={selectedNo}
              {...record}
            />
          ))}
        </blessed-box>
      </blessed-box>
    )
  }
}
