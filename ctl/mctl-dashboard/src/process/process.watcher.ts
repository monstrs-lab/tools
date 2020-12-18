import { EventEmitter } from 'events'
import { ChildProcess } from 'child_process'

export class ProcessWatcher extends EventEmitter {
  change = (process?: ChildProcess | null) => {
    this.emit('changed', process)
  }
}
