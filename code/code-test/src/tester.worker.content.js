/* eslint-disable */
let hook

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib')
      .brotliDecompressSync(
        Buffer.from(
          'G7AHAIzDOIb8MbQSyzH/W87uvZzeOqwKWVEn9lMnM0C8NIhCyk6/3NvkFeFPe5Rk3m6SmZ2EknxKr2pzpal/GgVCHr5KrINN/vzxi3FTDXnqzc6ZHBeUwt7DGXlz5rBHmPoSKg/TjSTmqZQYLGzLngFTn9C6SloWulxOE6zi4qx4fU3G2iVDglVtlp5lwUzwUVk7ljKm5OYuv/doyeH8scFRwSO91ib7UKhXE3LimBht94bE8jY6gVEHN+NFR5HrQ/V755U5U9mQz2YbU0XSedfnJYhn2WSUzrD0fDqvT9XiwOLePmgLXQV0CQdO0OQbDUi6aaOMfwczOE3TomGs5hhuhILbP32q/rCHsUZy9eD5UuG0E8wLDUtNa/SiQYv5j1wNMRqBhee/NW4LALoJmGcxvB0pnOczdEPhjYIFNNvzwp+/9/74E9cicyGnqT0vpQmod1jIufHOOJ19Lfbdet4DXLd0bwZe7peph78uksoXX1/k9dnLqzy9ellz5xP5fvYsV/558u8d7GG84bMVI3ZNiCFFCJLX0eBUqLnlNHsz3Ai7L5WKCNmYbG7jAbfkMmfefIAC1rJuadaNZC8q4vmBxYBwmDLWzx9nr577RRCiDK0k6oYS9lRyGyQv0EGRNGGNB4Y7hDR6f0wW4pJtkeJkY0xyS+I+5qI1Pp8DsEXiquTC8vxh+5UC3RZ2/TVYfvfdZU73rdw+VqDbOfZqmjD3oQfbOe1qkSNnAVG3cwTgv2OyFNlbCvoGg7BPnl1ehqcuYu9BndKmQUwMLMXoeCgCWX+gQ0P4aXGffnCbAdtSpqDxuIpT1VxIu+08565Ul6142UMixvuIO+m3uknFUt/UGeIm1w172zqh555ZdtB/9C9iRyBOuBhQ8PlyGTm35d4wKE9Std1O0QYi25QOqaJ814Tx7twvrEQfaAopqsJCy1UO6sZ+0LSoM3Vye8Uy89m8n6iI//gAosyx5lZ4cTW4ae3hiwoYh0T06uZCTGB825w/',
          'base64'
        )
      )
      .toString()

  return hook
}
