import { readFileSync } from 'node:fs'

import { Source }       from '@angular-devkit/schematics'
import { join }         from '@angular-devkit/core'
import { strings }      from '@angular-devkit/core'
import { apply }        from '@angular-devkit/schematics'
import { mergeWith }    from '@angular-devkit/schematics'
import { move }         from '@angular-devkit/schematics'
import { template }     from '@angular-devkit/schematics'
import { url }          from '@angular-devkit/schematics'
import { chain }        from '@angular-devkit/schematics'

// eslint-disable-next-line arrow-body-style
const generateCommon = (options): Source => {
  return apply(url('./files/common'), [
    template({
      ...strings,
      ...options,
      dot: '.',
    }),
    move('./'),
  ])
}

const generateProjectSpecifiec = (options): Source => {
  const { name: projectName } = JSON.parse(readFileSync(join(options.cwd, 'package.json'), 'utf-8'))

  return apply(url(`./files/${options.type}`), [
    template({
      ...strings,
      ...options,
      projectName,
      dot: '.',
    }),
    move('./'),
  ])
}

export const main = (options) =>
  chain([mergeWith(generateCommon(options)), mergeWith(generateProjectSpecifiec(options))])
