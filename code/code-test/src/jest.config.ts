import { emotionJestSerializer } from '@monstrs/code-runtime'
import { jestStaticStubs }       from '@monstrs/code-runtime'
import { tsJest }                from '@monstrs/code-runtime'

import { accessSync }            from 'fs'
import { join }                  from 'path'

import { tsconfig }              from '@monstrs/code-typescript'

const isFileExists = (file: string) => {
  try {
    accessSync(file)

    return true
  } catch {
    return false
  }
}

export const buildUnitConfig = (root: string) => ({
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
  testRegex: '\\.test\\.(ts|tsx)$',
  modulePathIgnorePatterns: ['dist', 'integration'],
  snapshotSerializers: [emotionJestSerializer],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|gif|png|mp4|mkv|avi|webm|swf|wav|mid)$': `${jestStaticStubs}/$1`,
  },
  globals: {
    'ts-jest': {
      tsconfig: tsconfig.compilerOptions,
      isolatedModules: true,
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': tsJest,
  },
  resolver: join(__dirname, '../resolver.js'),
  globalSetup: isFileExists(join(root, '.config/test/unit/setup.ts'))
    ? join(root, '.config/test/unit/setup.ts')
    : undefined,
  globalTeardown: isFileExists(join(root, '.config/test/unit/teardown.ts'))
    ? join(root, '.config/test/unit/teardown.ts')
    : undefined,
})

export const buildIntegrationConfig = (root: string) => ({
  testRegex: '/integration/.*\\.test\\.(ts|tsx)$',
  modulePathIgnorePatterns: ['dist'],
  snapshotSerializers: [emotionJestSerializer],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|gif|png|mp4|mkv|avi|webm|swf|wav|mid)$': `${jestStaticStubs}/$1`,
  },
  globals: {
    'ts-jest': {
      tsconfig: tsconfig.compilerOptions,
      isolatedModules: true,
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': tsJest,
  },
  resolver: join(__dirname, '../resolver.js'),
  globalSetup: isFileExists(join(root, '.config/test/integration/setup.ts'))
    ? join(root, '.config/test/integration/setup.ts')
    : undefined,
  globalTeardown: isFileExists(join(root, '.config/test/integration/teardown.ts'))
    ? join(root, '.config/test/integration/teardown.ts')
    : undefined,
})
