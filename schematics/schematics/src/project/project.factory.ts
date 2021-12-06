import { Source }    from '@angular-devkit/schematics'
import { strings }   from '@angular-devkit/core'
import { apply }     from '@angular-devkit/schematics'
import { mergeWith } from '@angular-devkit/schematics'
import { move }      from '@angular-devkit/schematics'
import { template }  from '@angular-devkit/schematics'
import { url }       from '@angular-devkit/schematics'

const generate = (options): Source => {
  return apply(url('./files'), [
    template({
      ...strings,
      ...options,
      dot: '.',
    }),
    move('./'),
  ])
}

export const main = () => mergeWith(generate({}))
