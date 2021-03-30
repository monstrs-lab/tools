import execa            from 'execa'
import tempy            from 'tempy'

import { Builder }      from '@monstrs/buildpack-core'
import { BuildContext } from '@monstrs/buildpack-core'
import { BuildResult }  from '@monstrs/buildpack-core'

export class YarnWorkspacePackBuilder implements Builder {
  async build(ctx: BuildContext): Promise<BuildResult> {
    const entry = ctx.plan.getEntry('yarn-workspace-pack')

    if (entry) {
      const { workspace } = entry.metadata

      const destination = tempy.directory()

      await execa(
        'yarn',
        ['workspace', workspace, 'app', 'pack', 'source', '--destination', destination],
        {
          stdio: 'inherit',
        }
      )

      await execa('rm', ['-f', '-r', `${process.cwd()}/*`])
      await execa('mv', [destination, process.cwd()])
    }
  }
}
