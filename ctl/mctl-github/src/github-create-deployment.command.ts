import fs                   from 'fs'
import { Command }          from 'clipanion'

import { createDeployment } from '@monstrs/code-github'

class GithubCreateDeploymentCommand extends Command {
  @Command.String(`-e,--environment`)
  environment: string = 'stage'

  @Command.String(`-p,--from-pushed-images`)
  fromPushedImages: string

  @Command.String(`-r,--extract-registry`)
  extractRegistry: string

  @Command.String(`-t,--exclude-tag`)
  excludeTag: string

  @Command.Path(`github`, `deployment`, `create`)
  async execute() {
    if (this.fromPushedImages) {
      let images = JSON.parse(fs.readFileSync(this.fromPushedImages).toString())

      if (this.excludeTag) {
        images = images.filter((image) => image.split(':').pop() !== this.excludeTag)
      }

      await Promise.all(
        images.map((image) =>
          createDeployment({
            environment: this.getEnvironmentForImage(image),
            description: `Deploy ${image}`,
            auto_merge: false,
            task: image,
            payload: {
              image,
            },
          })
        )
      )
    }
  }

  getEnvironmentForImage(image) {
    const parts = image.split(':')

    parts.pop()

    let name = parts.join(':')

    if (this.extractRegistry) {
      name = name.replace(this.extractRegistry, '')
    }

    return `${this.environment}-${name}`
  }
}

export { GithubCreateDeploymentCommand }
