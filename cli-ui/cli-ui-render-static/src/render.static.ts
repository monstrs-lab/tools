import type { ReactElement }     from 'react'

import { render } from 'ink'
import { EventEmitter } from 'node:events';

export class OutputStream extends EventEmitter {
  readonly frames: Array<string> = [];

  get columns(): number {
    return process.stdout.columns || 160
  }

  write = (frame: string): void => {
    this.frames.push(frame);
  }
}

export const renderStatic = (
  tree: ReactElement,
): string => {
  const stdout = new OutputStream()
  const stderr = new OutputStream()

  const { cleanup } = render(tree, {
    stdout: stdout as any,
    stderr: stderr as any,
    debug: true,
    exitOnCtrlC: false,
    patchConsole: false,
  });

  cleanup()

  return [
    ...stdout.frames,
    ...stderr.frames
  ].join('\n')
}
