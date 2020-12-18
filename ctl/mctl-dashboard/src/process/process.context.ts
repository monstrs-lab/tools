import { createContext }  from 'react'

import { ProcessWatcher } from './process.watcher'

export const Context = createContext<ProcessWatcher | null>(null)

export const { Provider, Consumer } = Context
