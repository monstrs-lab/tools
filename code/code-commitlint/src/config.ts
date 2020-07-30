const config = {
  extends: [
      require.resolve('@commitlint/config-lerna-scopes'),
      require.resolve('@commitlint/config-conventional')
  ],
  rules: {
    'scope-enum': [0, 'always', ['deps', 'common', 'front', 'back', 'devops']],
    'header-max-length': [0, 'always', 140],
  } as any,
}

export { config }
