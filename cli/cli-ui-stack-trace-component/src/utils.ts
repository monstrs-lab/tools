import { StackFrame } from '@monstrs/stack-trace'

import fs             from 'fs'

export const getFrameSource = (frame: StackFrame): string | null => {
  if (frame.sourceMap) {
    return frame.sourceMap.payload.sourcesContent[0]
  }

  if (frame.file) {
    try {
      return fs.readFileSync(frame.file, 'utf-8')
      // eslint-disable-next-line
    } catch (error) {}
  }

  return null
}
