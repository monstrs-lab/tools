import { base } from '@monstrs/code-typescript'

export const config = {
  testRegex: '\\.test\\.(ts|tsx)$',
  modulePathIgnorePatterns: ['dist'],
  snapshotSerializers: [require.resolve('jest-emotion')],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|gif|png|mp4|mkv|avi|webm|swf|wav|mid)$': 'jest-static-stubs/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: base.compilerOptions,
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': require.resolve('ts-jest'),
  },
}
