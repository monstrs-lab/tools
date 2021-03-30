import path                               from 'path'
import { Command }                        from 'clipanion'

import { Diagnostic, DiagnosticCategory } from '@monstrs/code-typescript'
import { TypeScript }                     from '@monstrs/code-typescript'
import { getRootWorkspace }               from '@monstrs/code-project'

import { Annotation, AnnotationLevel }    from './github'
import { Conclusion, createCheck }        from './github'

const getAnnotationLevel = (category: number): AnnotationLevel => {
  if (category === DiagnosticCategory.Warning) {
    return AnnotationLevel.Warning
  }

  return AnnotationLevel.Failure
}

const formatDiagnostic = (diagnostic: Diagnostic, details: string): Annotation => {
  let filePath = ''
  let line = 0

  if (diagnostic.file) {
    const pos = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
    line = pos.line + 1

    filePath = path.posix.normalize(
      path.relative(process.cwd(), diagnostic.file.fileName).replace(/\\/, '/')
    )
  }

  // eslint-disable-next-line prefer-destructuring
  let messageText: any = diagnostic.messageText

  if (messageText && messageText.messageText) {
    messageText = messageText.messageText
  }

  return {
    path: filePath,
    start_line: line,
    end_line: line,
    title: messageText,
    message: messageText,
    raw_details: details,
    annotation_level: getAnnotationLevel(diagnostic.category),
  }
}

class TypeCheckCommand extends Command {
  @Command.Path(`check`, `typecheck`)
  async execute() {
    const ts = new TypeScript()

    const { manifest } = await getRootWorkspace()

    const result = ts.check(manifest.workspaceDefinitions.map((definition) => definition.pattern))

    const annotations = Object.values(result)
      .flat()
      .filter((diagnostic: Diagnostic) => diagnostic.file)
      .map((diagnostic: Diagnostic) =>
        formatDiagnostic(diagnostic, ts.formatDiagnostic(diagnostic, true))
      )

    await this.check(
      result.errors.length > 0 ? Conclusion.Failure : Conclusion.Success,
      annotations
    )
  }

  async check(conclusion, annotations) {
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

export { TypeCheckCommand }
