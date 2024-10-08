import { BaseCommand }          from '@yarnpkg/cli'
import { Configuration }        from '@yarnpkg/core'
import { Project }              from '@yarnpkg/core'
import { Filename }             from '@yarnpkg/fslib'
import { ppath }      from '@yarnpkg/fslib'
import { scriptUtils }          from '@yarnpkg/core'
import { execUtils }            from '@yarnpkg/core'
import { xfs }                  from '@yarnpkg/fslib'
import { Option }               from 'clipanion'
import { render }               from 'ink'
import React                    from 'react'

import { ErrorInfo }            from '@monstrs/cli-ui-error-info'
import { TypeScriptDiagnostic } from '@monstrs/cli-ui-typescript-diagnostic'
import { TypeScriptProgress }   from '@monstrs/cli-ui-typescript-progress'
import { TypeScript }           from '@monstrs/code-typescript'
import { renderStatic }         from '@monstrs/cli-ui-renderer-static'

export class TypesCheckCommand extends BaseCommand {
  static override paths = [['types', 'check']]

  args: Array<string> = Option.Rest({ required: 0 })

  override async execute(): Promise<number> {
    const nodeOptions = process.env.NODE_OPTIONS ?? ''

    if (nodeOptions.includes(Filename.pnpCjs) && nodeOptions.includes(Filename.pnpEsmLoader)) {
      return this.executeRegular()
    }

    return this.executeProxy()
  }

  async executeProxy(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const binFolder = await xfs.mktempPromise()

    const { code } = await execUtils.pipevp('yarn', ['types', 'check', ...this.args], {
      cwd: this.context.cwd,
      stdin: this.context.stdin,
      stdout: this.context.stdout,
      stderr: this.context.stderr,
      env: await scriptUtils.makeScriptEnv({ binFolder, project }),
    })

    return code
  }

  async executeRegular(): Promise<number> {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins)
    const { project } = await Project.find(configuration, this.context.cwd)

    const typescript = await TypeScript.initialize(project.cwd)

    const { clear } = render(<TypeScriptProgress typescript={typescript} />)

    try {
      const diagnostics = await typescript.check(await this.getIncludes(project))

      diagnostics.forEach((diagnostic) => {
        renderStatic(<TypeScriptDiagnostic {...diagnostic} />)
          .split('\n')
          .forEach((line) => {
            console.log(line) // eslint-disable-line no-console
          })
      })

      return diagnostics.length === 0 ? 0 : 1
    } catch (error) {
      renderStatic(<ErrorInfo error={error as Error} />)
        .split('\n')
        .forEach((line) => {
          console.error(line) // eslint-disable-line no-console
        })

      return 1
    } finally {
      clear()
    }
  }

  protected async getIncludes(project: Project): Promise<Array<string>> {
    if (this.args.length > 0) {
      return this.args
    }

    if (await xfs.existsPromise(ppath.join(project.cwd, 'tsconfig.json'))) {
      const tsconfig: { include?: Array<string> } = await xfs.readJsonPromise(
        ppath.join(project.cwd, 'tsconfig.json')
      )

      if (tsconfig.include && tsconfig.include.length > 0) {
        return tsconfig.include
      }
    }

    return project.topLevelWorkspace.manifest.workspaceDefinitions.map(
      (definition) => definition.pattern
    )
  }
}
