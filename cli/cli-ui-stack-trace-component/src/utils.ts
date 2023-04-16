import { readFileSync } from 'node:fs'

import { StackFrame }   from '@monstrs/stack-trace'

export const getFrameSource = (frame: StackFrame): string | null => {
  if (frame.sourceMap) {
    return frame.sourceMap.payload.sourcesContent[0]
  }

  if (frame.file) {
    try {
      return readFileSync(frame.file, 'utf-8')
      // eslint-disable-next-line
    } catch (error) {}
  }

  return null
}
