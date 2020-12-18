import React               from 'react'
import blessed             from 'blessed'
import { render }          from 'react-blessed'

import { Logs }            from '@monstrs/mctl-dashboard'
import { LogsReader }      from '@monstrs/mctl-dashboard'
import { ProcessConsumer } from '@monstrs/mctl-dashboard'
import { ProcessProvider } from '@monstrs/mctl-dashboard'
import { ProcessWatcher }  from '@monstrs/mctl-dashboard'

export const dashboard = () => {
  const processWatcher = new ProcessWatcher()

  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Service Dashboard',
  })

  screen.key(['C-c'], (ch, key) => {
    return process.exit(0)
  })

  render(
    <ProcessProvider value={processWatcher}>
      <ProcessConsumer>
        {(proc) => <LogsReader process={proc}>{(rows) => <Logs rows={rows} />}</LogsReader>}
      </ProcessConsumer>
    </ProcessProvider>,
    screen
  )

  return processWatcher
}
