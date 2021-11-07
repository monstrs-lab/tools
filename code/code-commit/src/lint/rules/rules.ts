export const rules = {
  extends: [
    require.resolve('@commitlint/config-conventional'),
    require.resolve('./header-max-length.rule'),
  ],
}
