import { BaseCommand } from '@yarnpkg/cli'
//import { Option }      from 'clipanion'

class FormatCommand extends BaseCommand {
  static paths = [['format']]

  //args: Array<string> = Option.Rest({ required: 0 })

  async execute() {
    console.log('adsfadsfasd')
    //await this.cli.run(['mctl', 'format'])
  }
}

export { FormatCommand }
