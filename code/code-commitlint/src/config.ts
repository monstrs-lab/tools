const config = {
  extends: ['@commitlint/config-lerna-scopes', '@commitlint/config-conventional'].map(
    (require as any).resolve
  ),
  rules: {
    'scope-enum': [0, 'always', ['deps', 'common', 'front', 'back', 'devops']],
    'header-max-length': [0, 'always', 140],
  },
}

export { config }
