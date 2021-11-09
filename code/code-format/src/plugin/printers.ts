import { format }           from 'prettier'

import { printer as align } from './import-align'

let printer

format(';', {
  parser(text, { typescript }, options) {
    const plugin: any = options.plugins.find((x: any) => x.printers && x.printers.estree)

    printer = plugin.printers.estree

    return typescript(text)
  },
})

export const printers = {
  'typescript-monstrs': {
    ...printer,
    ...align,
  },
}
