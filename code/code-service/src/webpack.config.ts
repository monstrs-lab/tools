import type { webpack as wp }      from '@monstrs/tools-runtime/webpack'

import type { WebpackEnvironment } from './webpack.interfaces.js'

import { writeFile }               from 'node:fs/promises'
import { mkdtemp }                 from 'node:fs/promises'
import { tmpdir }                  from 'node:os'
import { join }                    from 'node:path'

import Config                      from 'webpack-chain-5'

import tsconfig                    from '@monstrs/config-typescript'

import { WebpackExternals }        from './webpack.externals.js'
import { LAZY_IMPORTS }            from './webpack.ignore.js'

export class WebpackConfig {
  constructor(
    private readonly webpack: typeof wp,
    private readonly loaders: {
      tsLoader: string
      nodeLoader: string
      nullLoader: string
    },
    private readonly cwd: string
  ) {}

  async build(
    environment: WebpackEnvironment = 'production',
    plugins: Array<{
      use: Config.PluginClass<wp.WebpackPluginInstance> | wp.WebpackPluginInstance
      args: Array<any>
      name: string
    }> = []
  ): Promise<wp.Configuration> {
    const config = new Config()

    await this.applyCommon(config, environment)
    await this.applyPlugins(config, environment)
    await this.applyModules(config)

    plugins.forEach((plugin) => {
      config.plugin(plugin.name).use(plugin.use, plugin.args)
    })

    return config.toConfig()
  }

  private async applyCommon(config: Config, environment: WebpackEnvironment): Promise<void> {
    config
      .mode(environment)
      .bail(environment === 'production')
      .target('async-node')
      .optimization.minimize(false)

    config.entry('index').add(join(this.cwd, 'src/index'))

    if (environment === 'development') {
      config.entry('hot').add('webpack/hot/poll?100')
    }

    config.output.path(join(this.cwd, 'dist')).filename('[name].js')
    config.output.chunkFormat(environment === 'development' ? 'commonjs' : 'module')
    config.output.module(true)

    config.resolve.extensions.add('.tsx').add('.ts').add('.js')
    config.resolve.extensionAlias
      .set('.js', ['.js', '.ts'])
      .set('.jsx', ['.jsx', '.tsx'])
      .set('.cjs', ['.cjs', '.cts'])
      .set('.mjs', ['.mjs', '.mts'])

    config.resolve.alias.set('class-transformer/storage', 'class-transformer/cjs/storage')

    config.externalsType('import')
    config.externalsPresets({ node: true })
    config.externals(['webpack/hot/poll?100', await new WebpackExternals(this.cwd).build()])

    config.devtool(environment === 'production' ? 'source-map' : 'eval-cheap-module-source-map')

    config.experiments({ outputModule: true })

    config.node.set('__dirname', true)
  }

  private async applyPlugins(config: Config, environment: WebpackEnvironment): Promise<void> {
    if (environment === 'development') {
      config.plugin('hot').use(this.webpack.HotModuleReplacementPlugin)

      config.plugin('banner').use(this.webpack.BannerPlugin, [
        {
          banner: `import { createRequire } from 'node:module'\nimport { fileURLToPath } from 'node:url'\nconst require = createRequire(import.meta.url)\nconst __filename = fileURLToPath(import.meta.url)\n`,
          raw: true,
        },
      ])
    }

    config.plugin('ignore').use(this.webpack.IgnorePlugin, [
      {
        checkResource: (resource: string): boolean => {
          if (resource.endsWith('js.map')) {
            return true
          }

          if (!LAZY_IMPORTS.includes(resource)) {
            return false
          }

          try {
            require.resolve(resource, {
              paths: [this.cwd],
            })
          } catch {
            return true
          }

          return false
        },
      },
    ])
  }

  private async applyModules(config: Config): Promise<void> {
    config.module
      .rule('d.ts')
      .test(/\.d\.ts$/)
      .use('null')
      .loader(this.loaders.nullLoader)

    const configFile = join(await mkdtemp(join(tmpdir(), 'tools-service-')), 'tsconfig.json')

    await writeFile(configFile, '{"include":["**/*"]}')

    config.module
      .rule('ts')
      .test(/(^.?|\.[^d]|[^.]d|[^.][^d])\.tsx?$/)
      .use('ts')
      .loader(this.loaders.tsLoader)
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
      .loader(this.loaders.nodeLoader)
  }
}
