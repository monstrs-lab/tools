import type { WebpackEnvironment } from './webpack.interfaces.js'

import { writeFile }               from 'node:fs/promises'
import { mkdtemp }                 from 'node:fs/promises'
import { join }                    from 'node:path'
import { tmpdir }                  from 'node:os'

import Config                      from 'webpack-chain-5'

import { webpack }                 from '@monstrs/code-runtime/webpack'
import { tsLoaderPath }            from '@monstrs/code-runtime/webpack'
import { nodeLoaderPath }          from '@monstrs/code-runtime/webpack'
import { stringReplaceLoaderPath } from '@monstrs/code-runtime/webpack'
import tsconfig                    from '@monstrs/config-typescript'

import { WebpackExternals }        from './webpack.externals.js'
import { LAZY_IMPORTS }            from './webpack.ignore.js'

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

    config.externalsPresets({ node: true })
    config.externals([await new WebpackExternals(this.cwd).build()])
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

    config.entry('index').add(join(this.cwd, 'src/index'))

    config.output.path(join(this.cwd, 'dist')).filename('index.js')
    config.output.chunkFormat('module')
    config.output.library({ type: 'module' })
    config.output.module(true)

    config.resolve.symlinks(true)
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
    config.plugin('ignore').use(webpack.IgnorePlugin, [
      {
        checkResource(resource) {
          if (!LAZY_IMPORTS.includes(resource)) {
            return false
          }

          try {
            require.resolve(resource, {
              paths: [this.cwd],
            })
          } catch (err) {
            return true
          }

          return false
        },
      },
    ])
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
}
