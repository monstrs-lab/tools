let hook

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib')
      .brotliDecompressSync(
        Buffer.from(
          'G6ANAIzDdKtxyzNwShnmv6vZfS6ntw4JpSsKYUWNsT91Jtp6gyiY9fW/P/p54KEkGFGde+97f9t2fUvbzlGBNp6n1sTy54v2MfS/QkZ0dq5aMnkIKg/Z6ArlNnd0CxgMXoqtgJygYFQ2/gMJzr2DwyD4nxFhfUJjDljhsE0xR3XrnRUVvP52oUM9gEpe1J9DNWTgUU4cWRtT0hmWMRBmRGpPTToV1aArDSofBu5VJkjRSBytbgVE4R43g8K602qJSAhvejDOL14VZ67q4SmlMlSKcs3e0gPEC3SSRBMsfZwIHRqtLCxl9oOaaDlEv8KBEGzw+gREXTyYyPduFf5hkLfKMEpmhBmHSmDzp0OjP5gYxSQbD9l/qHhoB0LIWHriHdtowGLpJMshplOw8PF3kxnnHgCtBEyyOPgd6VDgCdy9kEaGBTAtIfz5u/fHdeT8ygUdLz/vpQmg2yzknHnFnKO+C26v67kLzLx+8Eag+y+qIKy9UlFSnrD2+ztpzqJBzA059/OwIgz+AkE8pVrFZIh8AdLBI2mUXD4aDGWzEemWOi8jF4FHNYzjlihYvL4m4voahhIeyM3iIEvLOkjJVypexAn9KMn15euLvT57ebWnVy+bLT2272fPdsunz/5uwWD+LjL/SHKghmzcsMKuLPQSE1EycUWg3Q6On4gSWkeYlzk9VS/9CxgO18l/B1kW85zjANgpqEbq21XBY+uVgtzT3uhrtKSlv2+GgP5m9TlibgZ5o//gMeI4072RpuVpK1fSk8hs1CqiVeBfx1RSVN5S0CneMREqL7zPC0OFVvfBndLOSpwWlBSjOISFeHFR1GLC2Ox9CkH+SjGfrlxM6ng0Fa0PG5JSxXv2ylUqPDRYpiF1VJK4KvFZKxkxUXkl9/qiuApJXWS4yMg5zqnv9ILhSer2F6puSxhqq2wloymMq8p8VSJS24A/BZe2qh+C1/DEGs0KxneH6zY66fofzWAQtH6wcOTVvHInt1dM9zXh55Y9lDJ2hX9XG7pdaTmM9m7zfQNm7xDZd+t301R2fFN8HzBf8M8p8+rB1sjB9wi1e9HFIlQoE3p8wggGP3/JXdjSiMig3mlQBnV8aCNLeauKakNc+3mlWzHyCowxmF+YMzscRntQVj5w3GaijHNURC9mhZtoOP6TaE1J41Gj1rmubaWSdPS5jymjAwE=',
          'base64'
        )
      )
      .toString()

  return hook
}
