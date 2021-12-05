import { Source }    from '@angular-devkit/schematics'
import { strings }   from '@angular-devkit/core'
import { apply }     from '@angular-devkit/schematics'
import { mergeWith } from '@angular-devkit/schematics'
import { move }      from '@angular-devkit/schematics'
import { template }  from '@angular-devkit/schematics'
import { url }       from '@angular-devkit/schematics'

const generate = (options): Source => {
  const path = './'

  return apply(url('./files'), [
    template({
      ...strings,
      ...options,
      dot: '.',
    }),
    move(path),
  ])
}

export const main = () => mergeWith(generate({}))
