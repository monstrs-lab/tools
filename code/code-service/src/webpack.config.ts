import { writeFile }                from 'node:fs/promises'
import { readFile }                 from 'node:fs/promises'
import { mkdtemp }                  from 'node:fs/promises'
import { join }                     from 'node:path'
import { tmpdir }                   from 'node:os'

import { findUp }                   from 'find-up'
import Config                       from 'webpack-chain-5'
import fg                           from 'fast-glob'

import { webpack }                  from '@monstrs/code-runtime/webpack'
import { tsLoaderPath }             from '@monstrs/code-runtime/webpack'
import { nodeLoaderPath }           from '@monstrs/code-runtime/webpack'
import { stringReplaceLoaderPath }  from '@monstrs/code-runtime/webpack'
import tsconfig                     from '@monstrs/config-typescript'

import { FORCE_UNPLUGGED_PACKAGES } from './webpack.externals.js'
import { UNUSED_EXTERNALS }         from './webpack.externals.js'

export type WebpackEnvironment = 'production' | 'development'

export class WebpackConfig {
  constructor(private readonly cwd: string) {}

  async build(
    environment: WebpackEnvironment = 'production',
    plugins: Array<any> = []
  ): Promise<webpack.Configuration> {
    const config = new Config()

    await this.applyCommon(config, environment)
    await this.applyPlugins(config, environment)
    await this.applyModules(config)

    config.externals(await this.getExternals())
    config.externalsType('import')

    plugins.forEach((plugin) => {
      config.plugin(plugin.name).use(plugin.use, plugin.args)
    })

    return config.toConfig()
  }

  private async applyCommon(config: Config, environment: WebpackEnvironment) {
    config
      .mode(environment)
      .bail(environment === 'production')
      .target('async-node')
      .optimization.minimize(false)

    config.node.set('__dirname', false).set('__filename', false)

    config.entry('index').add(join(this.cwd, 'src/index'))

    config.output.path(join(this.cwd, 'dist')).filename('[name].js')
    config.output.chunkFormat('module')
    config.output.library({ type: 'module' })
    config.output.module(true)

    config.resolve.extensions.add('.tsx').add('.ts').add('.js')
    config.resolve.extensionAlias
      .set('.js', ['.js', '.ts'])
      .set('.jsx', ['.jsx', '.tsx'])
      .set('.cjs', ['.cjs', '.cts'])
      .set('.mjs', ['.mjs', '.mts'])

    config.resolve.alias.set('class-transformer/storage', 'class-transformer/cjs/storage')

    config.devtool(environment === 'production' ? 'source-map' : 'eval-cheap-module-source-map')

    config.experiments({ outputModule: true })
  }

  private async applyPlugins(config: Config, environment: WebpackEnvironment) {
    config.when(environment === 'development', () => {
      config.plugin('hot').use(webpack.HotModuleReplacementPlugin)
    })
  }

  private async applyModules(config: Config) {
    const configFile = join(await mkdtemp(join(tmpdir(), 'tools-service-')), 'tsconfig.json')

    await writeFile(configFile, '{"include":["**/*"]}')

    config.module
      .rule('ts')
      .test(/.tsx?$/)
      .use('ts')
      .loader(tsLoaderPath)
      .options({
        transpileOnly: true,
        experimentalWatchApi: true,
        onlyCompileBundledFiles: true,
        compilerOptions: { ...tsconfig.compilerOptions, sourceMap: true },
        context: this.cwd,
        configFile,
      })

    config.module
      .rule('node')
      .test(/\.node$/)
      .use('node')
      .loader(nodeLoaderPath)

    config.module
      .rule('replace-typeorm')
      .test(/PostgresDriver\.js$/)
      .use('replace-typeorm')
      .loader(stringReplaceLoaderPath)
      .options({
        search: `PlatformTools_1.PlatformTools.load("pg-native")`,
        replace: 'undefined',
      })
  }

  async getUnpluggedDependencies(): Promise<Set<string>> {
    const yarnFolder = await findUp('.yarn')

    if (!yarnFolder) {
      return Promise.resolve(new Set())
    }

    const pnpUnpluggedFolder = join(yarnFolder, 'unplugged')
    const dependenciesNames = new Set<string>()

    const entries = await fg('*/node_modules/*/package.json', {
      cwd: pnpUnpluggedFolder,
    })

    await Promise.all(
      entries
        .map((entry) => join(pnpUnpluggedFolder, entry))
        .map(async (entry) => {
          try {
            const { name } = JSON.parse((await readFile(entry)).toString())

            if (name && !FORCE_UNPLUGGED_PACKAGES.has(name)) {
              dependenciesNames.add(name)
            }
          } catch {} // eslint-disable-line
        })
    )

    return dependenciesNames
  }

  async getWorkspaceExternals(): Promise<Set<string>> {
    try {
      const { dependencies = {}, tools = {} } = JSON.parse(
        await readFile(join(this.cwd, 'package.json'), 'utf-8')
      )

      return new Set([...Object.keys(dependencies), ...(tools.service?.externals || [])])
    } catch {
      return Promise.resolve(new Set())
    }
  }

  async getExternals(): Promise<{ [key: string]: string }> {
    const workspaceExternals: Array<string> = Array.from(await this.getWorkspaceExternals())

    const unpluggedExternals: Array<string> = Array.from(await this.getUnpluggedDependencies())

    const workspaceAndUnpluggedExternals = Array.from(
      new Set([...workspaceExternals, ...unpluggedExternals])
    ).reduce(
      (result, dependency) => ({
        ...result,
        [dependency]: `import ${dependency}`,
      }),
      {}
    )

    return {
      ...UNUSED_EXTERNALS,
      ...workspaceAndUnpluggedExternals,
    }
  }
}
