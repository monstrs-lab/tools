/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-string-refs */
/* eslint-disable no-param-reassign */

import React         from 'react'
import { Component } from 'react'

import { List }      from './list'
import { Detail }    from './detail'

export type KeyMapHandler = (...args: any[]) => void

export interface KeyMap {
  down: KeyMapHandler
  up: KeyMapHandler
  g: KeyMapHandler
  space: KeyMapHandler
  enter: KeyMapHandler
  escape: KeyMapHandler
}

export class Logs extends Component<any, any> {
  keyMap: KeyMap

  constructor(props) {
    super(props)

    const initialRow = process.stdout.rows - 3

    this.state = {
      rows: [],
      selectedIndex: 0,
      showDetail: false,
      detailMode: 'breakdown',
      currentRangeStart: 0,
      maxRow: initialRow,
      halfRow: initialRow,
      currentRow: initialRow,
      subviewScroll: null,
      rouwsLength: null,
    }

    this.keyMap = {
      down: this.moveIndex.bind(this, 1),
      up: this.moveIndex.bind(this, -1),
      g: this.moveToEdge.bind(this),
      space: this.movePage.bind(this),
      enter: this.showDetail.bind(this, true),
      escape: this.showDetail.bind(this, false),
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.rows.length !== prevState.rouwsLength) {
      return {
        rouwsLength: nextProps.rows.length,
      }
    }

    return null
  }

  componentDidMount() {
    this.setMaxRow()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.rouwsLength !== this.state.rouwsLength) {
      const selectedIndex = this.props.rows.length - 1

      if (
        this.state.selectedIndex === this.props.rows.length - 2 &&
        this.state.selectedIndex !== selectedIndex
      ) {
        this.setState({
          selectedIndex,
        })
      } else {
        const { showDetail, halfRow, maxRow } = this.state

        const rowsCount = showDetail ? halfRow : maxRow

        if (this.props.rows.length - selectedIndex < rowsCount) {
          this.setDisplayRange()
        }
      }
    }

    if (prevState.selectedIndex !== this.state.selectedIndex) {
      this.setDisplayRange()
    }
  }

  setMaxRow() {
    const maxRow = process.stdout.rows - 3
    this.setState({ maxRow, halfRow: Math.floor(maxRow / 2) - 1 })
    this.setDisplayRange()
  }

  onKeypress = (char, key) => {
    if (!(this.state.showDetail && !char)) {
      const handler = this.keyMap[key.name]

      if (handler) {
        handler(key)
      }
    }
  }

  setDisplayRange() {
    const { selectedIndex, showDetail, maxRow, halfRow, currentRangeStart } = this.state
    const currentRow = showDetail ? halfRow : maxRow

    let nextRangeStart

    if (selectedIndex < currentRangeStart) {
      nextRangeStart = selectedIndex
    } else if (selectedIndex >= currentRangeStart + currentRow) {
      nextRangeStart = selectedIndex - currentRow + 1
    } else {
      nextRangeStart = currentRangeStart
    }

    const rows = this.props.rows.slice(nextRangeStart, nextRangeStart + currentRow)

    this.setState({ rows, currentRow, currentRangeStart: nextRangeStart, subviewScroll: null })
  }

  showDetail(enable) {
    this.setState({ showDetail: enable })
    this.setDisplayRange()
  }

  movePage(key) {
    const { selectedIndex, currentRow } = this.state
    const amount = key.shift ? currentRow * -1 : currentRow

    this.move(selectedIndex + amount)
  }

  moveToEdge(key) {
    this.move(key.shift ? this.props.rows.length - 1 : 0)
  }

  moveIndex(amount, key) {
    if (key.shift) {
      this.scrollSubview(amount)
    } else {
      this.move(this.state.selectedIndex + amount)
    }
  }

  move(nextIndex) {
    const maxIndex = this.props.rows.length - 1

    if (nextIndex < 0) {
      nextIndex = 0
    } else if (nextIndex > maxIndex) {
      nextIndex = maxIndex
    }

    this.setState({ selectedIndex: nextIndex })
  }

  scrollSubview(amount) {
    let actualAmount
    if (this.state.subviewScroll === amount) {
      actualAmount = amount
    } else {
      this.setState({ subviewScroll: amount })
      actualAmount = (this.state.maxRow - this.state.halfRow - 2) * amount
    }

    // @ts-ignore
    this.refs.detail?.scroll(actualAmount)
  }

  render() {
    const {
      rows,
      showDetail,
      detailMode,
      selectedIndex,
      currentRangeStart,
      currentRow,
      halfRow,
    } = this.state

    const selectedData = this.props.rows[selectedIndex] || {}
    const detailProps = {
      top: halfRow + 3,
      height: `100%-${halfRow + 3}`,
      data: selectedData,
      mode: detailMode,
    }

    return (
      <blessed-box mouse={false} scrollable={false} width='100%' onResize={this.setMaxRow}>
        <List
          height={currentRow}
          onKeypress={this.onKeypress}
          locked={showDetail}
          data={rows}
          selectedNo={selectedIndex - currentRangeStart}
        />
        {showDetail && <Detail onKeypress={this.onKeypress} ref='detail' {...detailProps} />}
      </blessed-box>
    )
  }
}
