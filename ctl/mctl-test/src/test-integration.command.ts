import { Command }     from 'clipanion'

import { integration } from '@monstrs/code-test'

class TestIntegrationCommand extends Command {
  @Command.Boolean(`-u,--update-shapshot`)
  updateSnapshot: boolean = false

  @Command.Boolean(`-u,--bail`)
  bail: boolean = false

  @Command.Boolean(`--find-related-tests`)
  findRelatedTests: boolean = false

  @Command.Boolean(`--json`)
  json: boolean = false

  @Command.Rest({ required: 0 })
  files: Array<string> = []

  @Command.Path(`test:integration`)
  async execute() {
    const { results } = await integration(
      process.cwd(),
      {
        findRelatedTests: this.findRelatedTests,
        updateSnapshot: this.updateSnapshot,
        bail: this.bail,
        silent: this.json,
      },
      this.files
    )

    if (this.json) {
      this.context.stdout.write(JSON.stringify(results))
    }
  }
}

export { TestIntegrationCommand }
