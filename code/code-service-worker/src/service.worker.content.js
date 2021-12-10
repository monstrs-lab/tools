/* eslint-disable */
let hook

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib')
      .brotliDecompressSync(
        Buffer.from(
          'Gx8DICwKTDf0rizmy4aYd3r4HIay5pbq8cV70Lf7nKkO2YwqbHGYIAp9BTSVd05HmSRC5f//qdGwRinn5t2fPXQKra4BVpB6QaQL7Qp6CYPqBPXE5LjBJywvaxAU4xgHBO4yLlsYHPAp2V2vRHSwW+bZoOtjr8MNF3ZkeT/fiMSvVcMPERPEEtxnSaElREp+T0QYkzOrRiSUzbvtaD4Ft7y704nZ9ZAAxr+uXEgvtTcrEd+/8b208q3YlMC2vlwNWU1YPd2z+rgnRLxj41uVmAjnmNdD+jrp3cGF0+zj/5ckmNWU5u1JPYgN4wvyg7nRuzJe8lUq8cOomb81zr0l2qUQT56RHkK2VpWk3YKjq1HJPSk0Qt+bhWqEcIhShGju3HkG',
          'base64'
        )
      )
      .toString()

  return hook
}
