import Config                              from 'webpack-chain'
import path                                from 'path'
import webpack                             from 'webpack'

import { getProjectUnpluggedDependencies } from '@monstrs/code-project'
import { getWorkspace }                    from '@monstrs/code-project'
import { base }                            from '@monstrs/code-typescript'

import { StartServerPlugin }               from './plugins'

export const createWebpackConfig = async (cwd, environment) => {
  const workspace = await getWorkspace(cwd)

  const workspaceExternals: Array<String> = Object.keys(
    workspace?.manifest?.raw?.externalDependencies || {}
  )
  const unpluggedExternals: Array<String> = Array.from(await getProjectUnpluggedDependencies())

  const externals = workspaceExternals.concat(unpluggedExternals).reduce(
    (result, dependency: string) => ({
      ...result,
      [dependency]: `commonjs2 ${dependency}`,
    }),
    {}
  )

  const config = new Config()

  config
    .mode(environment)
    .bail(environment === 'production')
    .target('async-node')
    .optimization.minimize(false)

  config.entry('index').add(path.join(cwd, 'src/index'))

  config.output.path(path.join(cwd, 'dist')).filename('[name].js')

  config.resolve.extensions.add('.tsx').add('.ts').add('.js')

  config.externals(externals)

  config.when(environment === 'development', () => {
    config.plugin('hot').use(webpack.HotModuleReplacementPlugin)
    config.plugin('start-server').use(StartServerPlugin, [{ entryName: 'index' }])
  })

  config.module
    .rule('ts')
    .test(/.tsx?$/)
    .use('ts')
    .loader(require.resolve('ts-loader'))
    .options({
      transpileOnly: true,
      experimentalWatchApi: true,
      compilerOptions: base.compilerOptions,
      configFile: path.join(__dirname, '../../tsconfig.stub.json'),
    })

  config.module
    .rule('protos')
    .test(/\.proto$/)
    .use('proto')
    .loader(require.resolve('./loaders/proto-dependencies.loader'))

  return config.toConfig()
}
