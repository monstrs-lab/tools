import { Detector }      from '@monstrs/buildpack-core'
import { DetectContext } from '@monstrs/buildpack-core'
import { DetectResult }  from '@monstrs/buildpack-core'

export class YarnWorkspaceStartDetector implements Detector {
  async detect(ctx: DetectContext): Promise<DetectResult> {
    if (!process.env.WORKSPACE) {
      return null
    }

    return {
      provides: [
        {
          name: 'yarn-workspace-start',
        },
      ],
      requires: [
        {
          name: 'yarn-workspace-start',
          metadata: {
            workspace: process.env.WORKSPACE,
          },
        },
      ],
    }
  }
}
