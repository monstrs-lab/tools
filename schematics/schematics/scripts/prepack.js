const { sync } = require('globby')
const { join } = require('path')
const { copyFileSync } = require('fs')
const { writeFileSync } = require('fs')

const pkg = require('../package.json')

const matches = sync(join(__dirname, '../src/**/*.json'))

matches.map(file => copyFileSync(file, file.replace('src/', 'dist/')))

writeFileSync(join(__dirname, '../package.json'), JSON.stringify({
    ...pkg,
    schematics: './dist/collection.json'
}, null, 2))