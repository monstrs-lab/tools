/* eslint-disable n/no-sync */
import { brotliDecompressSync } from 'node:zlib'

let hook: string | undefined

export const getContent = (): string => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(
      Buffer.from(
        'G3sMACwObHCbS9uxK4pGf5CFzp60mdPXV2WnoAzQOQ2QHPLKzhE2iIJZ31YASdmRCildrQDC0nW/vVMpvEE5snjkc3TNo2OuXDq37UMia8y2ttpMG+Js9ipICUlu1ISCKC2DVa2jB+0VgcAl+npjtOMUOOygKgahnvWpGCUe1qyU55wAXR9SFUQri3KZvorjzgiFTo+RHOw+728RONNhBscmFxhH9NkgVsc3l2NmiWjzwdKwniDU3VwasYMLtuozGUa9hfH6AmtzAZT0uVvqBcxJXY2QQe+5wv+6gOBtqRGoEaiCIYHNxhGLm4hyznyKUiX48iyuTp9fxMnl85IfT4m30yex8MhLTp+AoFlxQDnbge0CgZ5bAUqDPlO6OatSkGWt03BqWHQoy7U2sXKoXo1Ut4/jgGykdClGYbP2V5BUUvb4IUnlkf3tlVk1+CKtoHgew0uINBztlwjv/0UOxCH/cPi7pzxViYmpwy73/WBlljzue1tO1XlaawXj5Ab4NncyDTjVTGxzphgq//xqV0bSiW6kNQ/fYChBmrqay4OoMnKvTuTaJOSzIukCXkH5d2UBC2HIxbY7jwMhnm89QawozUf5YI6eNDhF8LftUqG+o4Pcp3yzERHWb5/+56yEiHW68AdVgFzdVi2t7NhTWF3lNoldyos0wNCdkWvCeHm08HRy6xG8IJDmriPPc+0VrskXEbEa75N7oewYG2upKBHuKMvY6tB3Prb+arJ0Dya3FDISpPqVkMOaecQAYhV8Vxyx16OHE/v1zVHFNvDIwMWK/gdgjPXqnwZqvEIJ1gnGxCjI/wrQKNrrpV6JRLkTw9BuBp/E/XXjbwFExHjlFg5R74T9xIVWxlOim9mXTzFwJyig2BZ/luhW61JIGgwV3BE3UKrrWNFeIFf0aEYNehmICJqxmkZN95MelUzjP4z3zsdo7iJc4KBYfsvgaBNYKwb/vK9TyUQScNzHy187tvDGrLWgzj1eeEoSHg6m/6AXyoXWpYvd2M60f9r2kK7VnRUStG0o+wM=',
        'base64'
      )
    ).toString()

  return hook
}
