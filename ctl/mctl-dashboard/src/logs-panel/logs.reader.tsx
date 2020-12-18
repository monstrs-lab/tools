/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */

import { Component } from 'react'
import split         from 'split2'
import { Transform } from 'stream'

const parseJson = (row) => {
  try {
    if (row) {
      const data = JSON.parse(row)

      if (data && !data.body) {
        return {
          body: data,
        }
      }

      return data
    }
  } catch (error) {
    return {
      body: row,
    }
  }
}

export class LogsReader extends Component<any, any> {
  stdoutReader: Transform

  stderrReader: Transform

  constructor(props) {
    super(props)

    this.state = {
      rows: [],
    }
  }

  componentDidMount() {
    if (this.props.process) {
      this.stdoutReader = split(parseJson, {})
      this.stderrReader = split(parseJson, {})

      this.props.process.stdout.pipe(this.stdoutReader).on('data', this.onData)
      this.props.process.stderr.pipe(this.stderrReader).on('data', this.onData)
    }
  }

  componentDidUpdate(props) {
    if (props.process !== this.props.process) {
      if (this.stdoutReader) {
        this.stdoutReader.end()
        this.stdoutReader.destroy()
      }

      if (this.stderrReader) {
        this.stderrReader.end()
        this.stderrReader.destroy()
      }

      if (this.props.process) {
        this.stdoutReader = split(parseJson, {})
        this.stderrReader = split(parseJson, {})

        this.props.process.stdout.pipe(this.stdoutReader).on('data', this.onData)
        this.props.process.stderr.pipe(this.stderrReader).on('data', this.onData)
      }
    }
  }

  onData = (data) => {
    if (data) {
      this.setState((state) => ({
        rows: state.rows.concat([data]),
      }))
    }
  }

  render() {
    const { children } = this.props
    const { rows } = this.state

    if (typeof children === 'function') {
      return children(rows)
    }

    return null
  }
}
