import Config                from 'webpack-chain'
import path                  from 'path'
import webpack               from 'webpack'

import { base }              from '@monstrs/code-typescript'

import { StartServerPlugin } from './plugins'
import { getExternals }      from './externals'

export const createWebpackConfig = async (cwd, environment) => {
  const externals = (await getExternals(cwd)).reduce(
    // @ts-ignore
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

  config.node.set('__dirname', false).set('__filename', false)

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
      compilerOptions: { ...base.compilerOptions, sourceMap: true },
      configFile: path.join(__dirname, '../../tsconfig.stub.json'),
    })

  config.module
    .rule('jaeger-client-thrift')
    .test(/thrift\.js$/)
    .use('jaeger-client-thrift')
    .loader(require.resolve('string-replace-loader'))
    .options({
      search: `_path2.default.join(__dirname, './jaeger-idl/thrift/jaeger.thrift')`,
      replace: `require('./jaeger-idl/thrift/jaeger.thrift').default`,
    })

  config.module
    .rule('jaeger-uds-sender-thrift')
    .test(/udp_sender\.js$/)
    .use('jaeger-uds-sender-thrift')
    .loader(require.resolve('string-replace-loader'))
    .options({
      search: `_path2.default.join(__dirname, '../thriftrw-idl/agent.thrift')`,
      replace: `require('../thriftrw-idl/agent.thrift').default`,
    })

  config.module
    .rule('protos')
    .test(/\.proto$/)
    .use('proto')
    .loader(require.resolve('./loaders/proto-dependencies.loader'))

  config.module
    .rule('thrift')
    .test(/\.thrift$/)
    .use('thrift')
    .loader(require.resolve('./loaders/thrift.loader'))

  config.devtool(
    environment === 'production' ? 'source-map' : ('eval-cheap-module-source-map' as any)
  )

  return config.toConfig()
}
