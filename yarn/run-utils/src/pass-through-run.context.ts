import { StreamOutput } from './stream.output.js'

export class PassThroughRunContext {
  public readonly stdout

  public readonly stderr

  private readonly stdoutOutput = new StreamOutput()

  private readonly stderrOutput = new StreamOutput()

  constructor() {
    this.stdout = this.stdoutOutput.stream
    this.stderr = this.stderrOutput.stream
  }

  get output(): string {
    return [this.stdoutOutput.data, this.stderrOutput.data].filter(Boolean).join('\n')
  }
}
