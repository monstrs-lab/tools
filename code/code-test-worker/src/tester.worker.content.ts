import { brotliDecompressSync } from 'node:zlib'

let hook

export const getContent = (): string => {
  if (typeof hook === `undefined`)
    hook = brotliDecompressSync(
      Buffer.from(
        'GykWAJwHtju0yXgoZWlp3l3/L1Xvvpx+JhAhSNoNpmMtvHgWSdE0w95qEAWzvgnS4xNuvrU3xU46zoSH4EATGIR8epJ2flmXf82ldqTdK/536bB0gDwmMBQmmNRlOMu060khcTLCP3PuRNX2wCSdA1I5hgMaJUj7/kSKnCIXZfnUf9YikmGwkw0iUERjJkTuE+EzNY8IgLAYVFTF9Ym73t2zgqNvrQmTMp9Cig3uaY7otWHZPv/wdmaWghZPGsamQuRqXszDspV0g5c2ps9L8YsjwHOSfchZnzti4LUzjfsdcXDBB0lWhX0bnBJO5+Kyk0646+1m9/diD0pzGJaA1JiogJ3CS4Ru2n5NCQHXSgCcd4HZdeWtvIDK0QVkNKjMkc8MI1Jy3CH4l0bZzO5OiPivEcTXUPWH3aKGp0diVlM/uGqOkekIaqGnGTywQZv7m921lKXHHx4jz8XT2wOiFF0sG0pCukBC9uuyuP/k1q7JyJEU0T0m28KYtYJeOBjZKcmBPQPpSb8tQCWdCPKXcW0TVBbURSTNsMuE2jfirC8sqN3xS2kLQ7iv/D2VZQS7vmZV/UJv77VARRSm6rqqQNGzTR0rbn0tUmNJiJnpRTCVIFFBxXp5BO075Eca2WD/TcQ1SgR1HWD3yBSF4iwBs3VQ/ubKoUHppd6kooygVU98VHbNcY/T979TEG9NJj29VEXUZjMVxRIQ6AtkNaCNI8XfAOkQLfSGpdyb3toZ0pk5qroM6iC9ghXaWaMzHthVcSmUoN/eNIQn2X9kmDnZPXwy2vSGiexQt8oTejZS0rJqNQBgcwnQVA5XVIFxmUWbCnOKAIswg432gy1MC+1/qUT9Ah+gWgcVT7m6DQPXENaYBQ44IBo2E8YiKQ6Xzp6CojgFh0NE0wraMOKRxDUB2f7u44FvjFNiBmJN47tVLR76CSCUWhWJiRf3CAk+dnoKIc+1enN7IZUn1bZ0+6cC1U1QJVqBtRaJINLpZrvG5Eqxl3NozaqaBUIaW8uvDDGYKYoPKrIIKxDjOX0vRfYYyOnc2greI32t7380C2n+sjYfe7Qr+Gm1TeBAyaJNq9Up61sW/N0gBAP6SsW3JRPFkSvgLvgydjC8l0RSW6yDkTw3aKq3nTMTO8Sedlk2XuQp2lB3kEaQoaKLhaVANBecQGNU3SWmcr+GK7tttyP78K8M6vZeEFH/Zr6VPmOy0VG0jVxUQw8OmsOSZijuh+oeBq+GA8pe2cHYJ5RZIfCktEtP2GEUPfLFtW63an0OOgM3gERa1cITuNxKGCeX9S0M+fvEDxtLIIJLy051Ac/XhVzIvSrbJkB5FEtiELLm4kGN8u2EjxIHB9oMW8WkJkeR7m2G7a2IqxRciXaQb8C+TT+/J0azvidpm0MfJgtcK+SSziaxJBFMcDjeSzf9h8y2K/bj+/Tdy+8/pi/efj/d8VvTXy+/TU+6/NDvS6Acp222Q4KR6BHFCuci6fcSL0SGmDEl1Y5ZapbyJC7l/OUcOsuRLrIUjyNLTE2dQ2os6qVcLf6wJiRHV/DuE4burg649QrOMe8Esz8+58sVi6HCXk4/W5hjYxD02FcCm35tws3qibLrvRcuCKi1lXqXwevGX13YZOfpgzVVLKU5KnzYvtE6yGlXPr+w52XmWSbZgrJlaqFRWMrEad5M/VNXYy6F5dNUWLYlxbPtJJsYNClFs//62zGHCA5WXyoutCwT2rf2wBjLKOkPbgCPe0JPNWbzvGvPKVzD3cKJtksYaG7RjHA8iJDnJ91Tn2pT0TJzOG5H2U3A6SWU1iO60oxbWM/v/yvATA/KlTjrTbFhZyltRz+OLPyioGFQC/Lkv1LksGx2OYBYBL9rHLGP3Q8ndv3No4ol2LXgYkH/B8QYq9V/klAz8jEzOpVmcK5IsEFvH5TM8KWXoPIP816FLI+zHzeEwdlbenzkEC5quRFROnFVMpic4wzT2AFyIS3hfiH6gc9lfShPsu44aWvF34ADi7Q1I9KfBQJVUAOTjXbUOL06kkEaqk3xHw==',
        'base64'
      )
    ).toString()

  return hook
}
