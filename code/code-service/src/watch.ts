import webpack from 'webpack'

import { createWebpackConfig } from './webpack'

export interface WatchOptions {
  cwd: string
}

export const watch = async (
  { cwd }: WatchOptions,
  callback = (error?: any) => undefined
): Promise<any> => {
  const config = await createWebpackConfig(cwd, 'development')

  const compiler = webpack(config)

  return compiler.watch({}, callback)
}
