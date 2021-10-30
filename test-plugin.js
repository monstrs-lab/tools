module.exports = {
    name: `plugin-addition`,
    factory: () => {
        require(`${__dirname}/.pnp.cjs`).setup()
        //require(`${__dirname}/utils/setup-ts-execution/src/index.js`)
        console.log(require('@monstrs/yarn-runtime'))
        return {
            commands: []
        }
    }
}