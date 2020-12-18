/* eslint-disable react/no-string-refs */

import React         from 'react'
import { Component } from 'react'

import { Tabs }      from './tabs.component'

export interface DetailProps {
  mode: string
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

    return <blessed-text scrollable ref='detail' content={content} height='100%' />
  }

  render() {
    const { mode, top, height, data, onKeypress } = this.props

    return (
      <blessed-box top={top} height={height} left='0' width='100%'>
        <blessed-text
          keys
          mouse
          focused
          scrollable
          top={1}
          left={0}
          height='100%'
          width='100%'
          onKeypress={onKeypress}
        >
          {this.renderDetail(data)}
        </blessed-text>
        <Tabs mode={mode} />
      </blessed-box>
    )
  }
}
