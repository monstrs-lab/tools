import { DiagnosticCategory } from 'typescript'

import { DiagnosticGroup }    from './constants'

export const groupDiagnostics = (diagnostics = []) =>
  diagnostics.reduce(
    (result, diagnostic) => {
      if (diagnostic.category === DiagnosticCategory.Error) {
        result[DiagnosticGroup.Error].push(diagnostic)
      } else if (diagnostic.category === DiagnosticCategory.Warning) {
        result[DiagnosticGroup.Warning].push(diagnostic)
      } else if (diagnostic.category === DiagnosticCategory.Suggestion) {
        result[DiagnosticGroup.Suggestion].push(diagnostic)
      } else if (diagnostic.category === DiagnosticCategory.Message) {
        result[DiagnosticGroup.Message].push(diagnostic)
      }

      return result
    },
    {
      [DiagnosticGroup.Warning]: [],
      [DiagnosticGroup.Error]: [],
      [DiagnosticGroup.Suggestion]: [],
      [DiagnosticGroup.Message]: [],
    }
  )
