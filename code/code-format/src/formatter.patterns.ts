import { join } from 'node:path'

export const ignore = [
  '.c9',
  '.pnp.js',
  '.pnp.cjs',
  '.pnp.loader.mjs',
  '.git',
  'node_modules',
  'coverage',
  'dist',
  'lib',
  '.yarn',
  '.vscode',
  '.next',
  '**/**/dist/*',
  '**/**/lib/*',
  '**/**/templates/*.yaml',
  '**/templates/*.yaml',
  '.terraform',
]

const patterns: string[] = ['./**/*.{js,mjs,cjs,ts,tsx,yml,yaml,json,graphql,md,mdx}']

const ignorePatterns: string[] = [
  '!**/node_modules/**',
  '!./node_modules/**',
  '!**/.{git,svn,hg}/**',
  '!./.{git,svn,hg}/**',
  '!**/.yarn/**',
  '!./.yarn/**',
]

export const createPatterns = (cwd: string): string[] => [
  ...patterns.map((pattern) => join(cwd, pattern)),
  ...ignorePatterns,
]
