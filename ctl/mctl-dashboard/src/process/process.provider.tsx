/* eslint-disable react/destructuring-assignment */

import React              from 'react'
import { Component }      from 'react'

import { Provider }       from './process.context'
import { ProcessWatcher } from './process.watcher'

export interface ProcessProviderProps {
  value?: ProcessWatcher
}

export interface ProcessProviderState {
  process: ProcessWatcher | null
}

export class ProcessProvider extends Component<ProcessProviderProps, ProcessProviderState> {
  constructor(props) {
    super(props)

    if (props.value) {
      props.value.on('changed', this.onProcessChanged)
    }

    this.state = {
      process: null,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      if (prevProps.value) {
        prevProps.value.removeListener('changed', this.onProcessChanged)
      }

      if (this.props.value) {
        this.props.value.on('changed', this.onProcessChanged)
      }
    }
  }

  onProcessChanged = (proc) => {
    this.setState({ process: proc })
  }

  render() {
    const { children } = this.props

    return <Provider value={this.state.process}>{children}</Provider>
  }
}
