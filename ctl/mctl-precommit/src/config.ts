const config = {
  '*.{yml,yaml,json,graphql,md}': 'yarn mctl staged format',
  '*.{js,jsx,ts,tsx}': ['yarn mctl staged format', 'yarn mctl staged lint'],
  '*.{ts,tsx}': ['yarn mctl staged typecheck'],
  '*.{tsx,ts}': ['yarn mctl staged test'],
}

export { config }
