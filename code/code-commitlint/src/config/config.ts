import loadConfig from '@commitlint/load'

export const config = {
  extends: [
    require.resolve('./scope-enum.config'),
    require.resolve('./header-max-length.config'),
    require.resolve('@commitlint/config-conventional'),
  ],
}

export const load = () => loadConfig(config)
