/* eslint-disable react/jsx-no-leaked-render */
/* eslint-disable n/no-sync */

import { readFileSync }  from 'node:fs'
import { pathToFileURL } from 'node:url'

import { BaseCommand }   from '@yarnpkg/cli'
import { Configuration } from '@yarnpkg/core'
import { Project }       from '@yarnpkg/core'
import { Filename }      from '@yarnpkg/fslib'
import { scriptUtils }   from '@yarnpkg/core'
import { execUtils }     from '@yarnpkg/core'
import { xfs }           from '@yarnpkg/fslib'
import { ppath }         from '@yarnpkg/fslib'
import { npath }         from '@yarnpkg/fslib'
import { Option }        from 'clipanion'
import { render }        from 'ink'
import { relative }      from 'path'
import React             from 'react'

import { ErrorInfo }     from '@monstrs/cli-ui-error-info'
import { LogRecord }     from '@monstrs/cli-ui-log-record'
import { RawOutput }     from '@monstrs/cli-ui-raw-output'
import { TestFailure }   from '@monstrs/cli-ui-test-failure'
import { TestProgress }  from '@monstrs/cli-ui-test-progress'
import { Tester }        from '@monstrs/code-test'
import { renderStatic }  from '@monstrs/cli-ui-renderer-static'

export abstract class AbstractTestCommand extends BaseCommand {
  target = Option.String('-t,--target')

  private std = new Map<string | undefined, Array<string>>()

  private bufferedStdTimeout: NodeJS.Timeout | undefined

  async executeProxy(type: 'integration' | 'unit'): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project, workspace } = await Project.find(configuration, this.context.cwd)

    const args: Array<string> = []

    if (workspace) {
      args.push('-t')
      args.push(this.context.cwd)
    }

    const binFolder = await xfs.mktempPromise()

    const env = await scriptUtils.makeScriptEnv({ binFolder, project })

    if (!env.NODE_OPTIONS!.includes('@monstrs/tools-runtime/ts-node-register')) {
      env.NODE_OPTIONS = `${env.NODE_OPTIONS} --loader @monstrs/tools-runtime/ts-node-register`
      env.NODE_OPTIONS = `${env.NODE_OPTIONS} --loader ${pathToFileURL(npath.fromPortablePath(ppath.join(project.cwd, Filename.pnpEsmLoader))).href}`
      env.NODE_OPTIONS = `${env.NODE_OPTIONS} --loader @monstrs/tools-runtime/ts-ext-register`
    }

    if (!env.NODE_OPTIONS!.includes('--enable-source-maps')) {
      env.NODE_OPTIONS = `${env.NODE_OPTIONS} --enable-source-maps`
    }

    const { code } = await execUtils.pipevp('yarn', ['test', type, ...args], {
      cwd: project.cwd,
      stdin: this.context.stdin,
      stdout: this.context.stdout,
      stderr: this.context.stderr,
      env,
    })

    return code
  }

  async executeRegular(type: 'integration' | 'unit'): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const onStdout = (data: TestStdout): void => {
      this.bufferedStd(data, (stdBuffer) => {
        this.renderStdBuffer(stdBuffer)
      })
    }

    const onStderr = (data: TestStderr): void => {
      this.bufferedStd(data, (stdBuffer) => {
        this.renderStdBuffer(stdBuffer)
      })
    }

    const onFail = (data: TestFail): void => {
      const source = data.file ? readFileSync(data.file, 'utf8') : undefined

      renderStatic(
        <TestFailure
          details={data.details}
          source={source}
          file={data.file ? relative(project.cwd, data.file) : undefined}
          column={data.column}
          line={data.line}
        />
      )
        .split('\n')
        .forEach((line) => {
          console.error(line) // eslint-disable-line no-console
        })
    }

    const tester = await Tester.initialize()

    tester.on('test:stdout', onStdout)
    tester.on('test:stderr', onStderr)
    tester.on('test:fail', onFail)

    const { clear } = render(<TestProgress cwd={project.cwd} tester={tester} />)

    try {
      const results =
        type === 'integration'
          ? await tester.integration(this.target ?? project.cwd)
          : await tester.unit(this.target ?? project.cwd)

      return results.find((result) => result.type === 'test:fail') ? 1 : 0
    } catch (error) {
      if (error instanceof Error) {
        renderStatic(<ErrorInfo error={error} />)
          .split('\n')
          .forEach((line) => {
            console.error(line) // eslint-disable-line no-console
          })
      } else {
        console.error(error) // eslint-disable-line no-console
      }

      return 1
    } finally {
      this.flushBufferedStd()

      tester.off('test:stdout', onStdout)
      tester.off('test:stderr', onStderr)
      tester.off('test:fail', onFail)

      clear()
    }
  }

  private bufferedStd(
    data: TestStderr | TestStdout,
    callback: (params: { file?: string; messages: Array<string> }) => void
  ): void {
    if (this.std.keys().next().value) {
      if (this.std.has(data.file)) {
        this.std.get(data.file)!.push(data.message)

        if (this.bufferedStdTimeout) {
          clearTimeout(this.bufferedStdTimeout)
        }

        this.bufferedStdTimeout = setTimeout(() => {
          const key: string | undefined = this.std.keys().next().value

          callback({ file: key, messages: this.std.get(key)! })

          this.std.delete(key)
        }, 100)
      } else {
        const key: string | undefined = this.std.keys().next().value

        callback({ file: key, messages: this.std.get(key)! })

        this.std.delete(key)

        this.std.set(data.file, [data.message])
      }
    } else {
      this.std.set(data.file, [data.message])
    }
  }

  private renderStdBuffer({ file, messages }: { file?: string; messages: Array<string> }): void {
    const items = messages.map((message) => message.split('\n').filter(Boolean)).flat()

    const { logRecords, raw } = items.reduce(
      (result: { logRecords: Array<any>; raw: Array<string> }, item: string) => {
        try {
          const logRecord = JSON.parse(item)

          return {
            ...result,
            logRecords: [...result.logRecords, logRecord],
          }
        } catch {
          return {
            ...result,
            raw: [...result.raw, item],
          }
        }
      },
      { logRecords: [], raw: [] }
    )

    logRecords.forEach((logRecord) => {
      // eslint-disable-next-line no-console
      console.log(renderStatic(<LogRecord {...logRecord} />))
    })

    if (raw.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        renderStatic(
          <RawOutput file={file ? relative(process.cwd(), file) : undefined} messages={raw} />
        )
      )
    }
  }

  private flushBufferedStd(): void {
    this.std.forEach((messages, file) => {
      this.renderStdBuffer({ file, messages })
    })
  }
}
