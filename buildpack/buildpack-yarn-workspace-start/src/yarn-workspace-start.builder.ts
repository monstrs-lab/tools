import { Builder }      from '@monstrs/buildpack-core'
import { BuildContext } from '@monstrs/buildpack-core'
import { BuildResult }  from '@monstrs/buildpack-core'

export class YarnWorkspaceStartBuilder implements Builder {
  async build(ctx: BuildContext): Promise<BuildResult> {
    const entry = ctx.plan.getEntry('yarn-workspace-start')

    if (entry) {
      const { workspace } = entry.metadata

      ctx.addWebProcess(['yarn', 'workspace', workspace, 'start'])
    }
  }
}
