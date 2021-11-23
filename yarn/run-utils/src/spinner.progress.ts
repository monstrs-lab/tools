import { Configuration } from '@yarnpkg/core'
import { MessageName }   from '@yarnpkg/core'
import { formatUtils }   from '@yarnpkg/core'

export class SpinnerProgress {
  static PROGRESS_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  static PROGRESS_INTERVAL = 120

  private running = false

  private position = 0

  constructor(private readonly stdout, private readonly configuration: Configuration) {}

  start() {
    if (this.stdout.isTTY) {
      this.running = true
      this.write()
      this.tick()
    }
  }

  end() {
    if (this.stdout.isTTY) {
      this.running = false
      this.clear(true)
    }
  }

  private tick() {
    setTimeout(() => {
      if (this.running) {
        this.clear()
        this.write()

        this.position = this.position >= SpinnerProgress.length ? 0 : this.position + 1

        this.tick()
      }
    }, SpinnerProgress.PROGRESS_INTERVAL)
  }

  private write() {
    const spinner = SpinnerProgress.PROGRESS_FRAMES[this.position]

    const name = formatUtils.pretty(
      this.configuration,
      `YN${MessageName.UNNAMED.toString(10).padStart(4, '0')}`,
      'gray'
    )

    this.stdout.write(
      `${formatUtils.pretty(this.configuration, '➤', 'blueBright')} ${name}: │ ${spinner}\n`
    )
  }

  private clear(complete = false) {
    // eslint-disable-next-line @typescript-eslint/quotes
    this.stdout.write(`\x1b[${0}A`)

    if (complete) {
      // eslint-disable-next-line @typescript-eslint/quotes
      this.stdout.write(`\x1b[0J`)
    }
  }
}
