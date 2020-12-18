/* eslint-disable react/no-string-refs */

import React         from 'react'
import { Component } from 'react'

export interface DetailProps {
  top: number | string
  height: number | string
  data: any
  onKeypress: (char: any, key: any) => void
}

export class Detail extends Component<DetailProps> {
  scroll(amount) {
    // @ts-ignore
    this.refs.detail?.scroll(amount)
  }

  renderDetail(data) {
    const content = JSON.stringify(data.body || '', null, 2)

    return <blessed-text scrollable ref='detail' content={content} />
  }

  render() {
    const { top, height, data, onKeypress } = this.props

    return (
      <blessed-box top={top} height={height} left='0' width='100%'>
        <blessed-text
          keys
          focused
          scrollable
          top={0}
          left={0}
          mouse={false}
          height='100%'
          width='100%'
          border={{ type: 'line' }}
          style={{ fg: 'white', border: { fg: 'white' } }}
          onKeypress={onKeypress}
        >
          {this.renderDetail(data)}
        </blessed-text>
      </blessed-box>
    )
  }
}
