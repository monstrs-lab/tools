import execa                                                    from 'execa'
import { Command }                                              from 'clipanion'

import { Annotation, AnnotationLevel, Conclusion, createCheck } from './github'

const getAnnotationLevel = (level: string): AnnotationLevel => {
  if (level !== 'failure') {
    return AnnotationLevel.Warning
  }

  return AnnotationLevel.Failure
}

const formatLine = (line: string): Annotation => {
  const [file, rule, message] = line.split(':')

  const [filePath, position] = file.split(/\(|\)/).filter((f: any) => f)
  const [startLine] = position.split(',')
  const [level] = rule.trim().split(' ')

  return {
    path: filePath,
    start_line: Number(startLine || 0),
    end_line: Number(startLine || 0),
    annotation_level: getAnnotationLevel(level),
    title: rule.trim(),
    message: message.trim(),
    raw_details: `(${rule.trim()}): ${message.trim()}`,
  }
}

class TypeCheckCommand extends Command {
  @Command.Path(`check`, `typecheck`)
  async execute() {
    try {
      const result = await execa('yarn', [
        'pnpify',
        'tsc',
        '--noEmit',
        '-p',
        process.cwd(),
        '--pretty',
        'false',
      ])

      await this.check(result.all)
    } catch (error) {
      await this.check(error.all)
    }
  }

  async check(output: string = '') {
    const annotations: Annotation[] = output
      .split('\n')
      .reduce((result: string[], line: string, index: number) => {
        if (line.includes(' TS')) {
          return [...result, line]
        }

        if (result.length > 0 && result[result.length - 1]) {
          result[result.length - 1] = result[result.length - 1] + line // eslint-disable-line
        }

        return result
      }, [])
      .map(formatLine)

    await createCheck(
      'TypeCheck',
      annotations.length > 0 ? Conclusion.Failure : Conclusion.Success,
      {
        title: annotations.length > 0 ? `Errors ${annotations.length}` : 'Successful',
        summary:
          annotations.length > 0 ? `Found ${annotations.length} errors` : 'All checks passed',
        annotations,
      }
    )
  }
}

export { TypeCheckCommand }
