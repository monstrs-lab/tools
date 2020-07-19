require('any-observable/register')(require.resolve('rxjs')) // eslint-disable-line

export * from './precommit.command'
export * from './lint-staged.command'
export * from './format-staged.command'
export * from './typecheck-staged.command'
export * from './test-staged.command'
