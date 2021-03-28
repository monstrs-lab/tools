const { default: plugin } = require('./src/index')

module.exports = {
  name: `@monstrs/plugin-essentials`,
  factory: () => plugin,
}
