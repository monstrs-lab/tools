import ts             from 'typescript'
import { parse }      from 'flatted'
import { stringify }  from 'flatted'
import { parentPort } from 'worker_threads'
import { workerData } from 'worker_threads'

const { config, cwd, noEmit } = workerData

const { fileNames, options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, cwd)

if (errors?.length > 0) {
  parentPort!.postMessage(errors)
} else {
  const program = ts.createProgram(fileNames, {
    ...options,
    noEmit,
  })

  const result = program.emit()
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(result.diagnostics)

  parentPort!.postMessage(parse(stringify(diagnostics)))
}
