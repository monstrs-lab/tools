import { dymanicRequire } from './utils'

export const jestCore = dymanicRequire.resolve('@jest/core')
export const emotionJestSerializer = dymanicRequire.resolve('@emotion/jest/serializer')
export const jestStaticStubs = dymanicRequire.resolve('jest-static-stubs')
export const tsJest = dymanicRequire.resolve('ts-jest')
export const jestPnpResolver = dymanicRequire.resolve('@monstrs/jest-pnp-resolver')
