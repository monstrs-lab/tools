const runtime = () => {
  try {
    return require('@monstrs/yarn-runtim/dist')
  } catch {
    require(`${process.cwd()}/.pnp.cjs`).setup()

    return require('@monstrs/yarn-runtime/dist')
  }
}

module.exports = runtime()
