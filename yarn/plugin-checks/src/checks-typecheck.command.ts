import { BaseCommand }        from '@yarnpkg/cli'
import { Configuration }      from '@yarnpkg/core'
import { Project }            from '@yarnpkg/core'
import { Command }            from 'clipanion'
import { xfs }                from '@yarnpkg/fslib'
import { ppath }              from '@yarnpkg/fslib'
import { toFilename }         from '@yarnpkg/fslib'

import { AnnotationLevel }    from '@monstrs/github-checks-utils'
import { Conclusion }         from '@monstrs/github-checks-utils'
import { createCheck }        from '@monstrs/github-checks-utils'
import { DiagnosticCategory } from '@monstrs/code-typescript'

class ChecksTypeCheckCommand extends BaseCommand {
  @Command.Path('checks', 'typecheck')
  async execute() {
    const { project } = await Project.find(
      await Configuration.find(this.context.cwd, this.context.plugins),
      this.context.cwd
    )

    const patterns = project.topLevelWorkspace.manifest.workspaceDefinitions.map(
      (definition) => definition.pattern
    )

    const report = ppath.join(await xfs.mktempPromise(), toFilename('report.json'))

    await this.cli.run(['mctl', 'typecheck', '--report', report, ...patterns])

    const diagnostics = await xfs.readJsonPromise(report)

    const annotations = diagnostics.map((diagnostic) => ({
      path: ppath.normalize(ppath.relative(project.cwd, diagnostic.file.fileName)),
      title: diagnostic.messageText,
      message: diagnostic.messageText,
      start_line: diagnostic.file.position.line + 1,
      end_line: diagnostic.file.position.line + 1,
      raw_details: diagnostic.messageText,
      annotation_level:
        diagnostic.category === DiagnosticCategory.Warning
          ? AnnotationLevel.Warning
          : AnnotationLevel.Failure,
    }))

    const conclusion = annotations.length > 0 ? Conclusion.Failure : Conclusion.Success

    await createCheck('TypeCheck', conclusion, {
      title: conclusion === Conclusion.Failure ? `Errors ${annotations.length}` : 'Successful',
      summary:
        conclusion === Conclusion.Failure
          ? `Found ${annotations.length} errors`
          : 'All checks passed',
      annotations,
    })
  }
}

export { ChecksTypeCheckCommand }
