/* eslint-disable */
let hook;

module.exports.getContent = () => {
  if (typeof hook === `undefined`)
    hook = require('zlib').brotliDecompressSync(Buffer.from('G7cQQIzEOBbygSIkxZp9U+17NdVe5D0Lp1aYn2Op0WiQjH0oj+GiTIP0KPj069dKfQnrVKQ5q7Ld7/1emq3UwBFgzxxNAFiYAyFcKirLcKJptyvEiABpNw+nS74OwUNrS0JC2nBC9RI4gOFZHjRLx8nDF9QJjtNqqzzB8mycogMHjpgny5in/3XrRxyO1lroItRXF1+RELJHwAGf9xoWmbmilr1tiEpMkqZkZVm7A9p6cVWWF6r5z2W5WEvTQ8GLvHK9uADVnC/wysqtMvjsTO8wEw6LNYfGHDW9metjz8Ktut3hudD+NxKhOXBLoYn7SzHM2FLkbE1bqgXtuQqwXk9a4Wz8KE84TXGTFrWrEjG8tgQjntuHbhtkIQcGp22T6gHw3XFKqTzbsVT/3wZkYvR56EVe+inBf0OAvjwe2lh6/RUR6Wb28oaEVfIYLwQZ0E/I9OcyPX3zYB+Z8GyF5FGPHqumTPfy5rxoXDNsm4ESLqxtDJ0mare8kzob0FroGzUamGMszWHXiFWxtFu7UZ6xw2Plf71pyrTDe6OFTvLnRxaHBlKkLG+rpb87poZJ2d67Qz+9ayMbOR7o8B2qBFhW/iAB17zQx/TqzniqLzHhDNjdM/t9oFiCqBm0t1mt6o/zysu0ksnkihcpKrvOIlKM4r+k2z2aSf36dhAJFhtsJYEUHW/aUofYcaGla+MTElWt6VKOhvdW1ra5Y5WGpV2nbQ9IWe5scXwJ6Kh6u5HoTLvTsETsPIExqBb9u8fb8KFHPYey2Zq8X2sSWdYxo+AwFlF6l9jyVHpjK29DVVOi6wJRUOS/YF9ZZMQJ7XncSQrlmUH3pgQ2kc7zvOrNRN2NsswHCWgwKUHdwDU0v16cz/0Zqy0sivsRCwCWfvI6wS9SZI+hPU3Hf6tYfXpMhoI6ryAaeGQWIpNiPkpC+K3Xmg0glZega07Ue0/SwG4qtOYajBtHrdA3r6hVdfJxJZdQCxcLoa/J5dYO3x2p8E7LI3hAtgbmsZsGR4RiGneWgu9wdvT7n2ZSxi/lxqM/W/Ff62yAg5Z6G/Zeo9A2Frp6i/F1dhP/uxchvnDFmDSPkcPukalfiFfDYGaaC9TrzozUS24oH0zTYuFLYZjOi1wgJSQ35EosZPbWIwoBbLMlPk1Qa58b04m58w9LKH0UDQz/g9TG3VwRMgVd6+zROh49MQ3PGDiYOdpwoXvHX/JNuBc9gqKSfE/puFosjFY8otAttm1PaHY5bUey/cL5DD9ArW9fMbN6jC9NRHRaKNtCwzQMt91FOOT8YxTg0/jXAWf9+4qjDb8fh085eoRHYRVJ+zP1edN4wuVhno/zDgDDvH9nvEOxU/62+nyLKstVp6/+43DfY0UTPGBie0oevC5wmqFk+ZDGV/qJDSlS0AM3eMJLeK0/Dzw4w9LmSvL8OQ/4Uj1StSshkxlERkZ+Pm/tczHdNBGRn+GEUeVlwkhVF4kxWyDlBPDqlRslVM2DO5kDK6dXxENSSSxCPRa6SMlAjEhV/q+JgtWIFZsWVAqk+dJ4AGwnVbMt0vPGO0K003rPd0e/MWpRg4Ka//JhIKWFrq6yWmpDa/4/qX7cS8P4sXcBETphbK4K5EgnDlnyZb3q2kxXcSbDQsPnch355Xn96YUWkiND4dR65Ug3TJEjkuZYuL3+2Uvaw2oqjogbu6oMr0e4DJkcNj70vsLGOoXNQlIvtxim5N9c3UDKg6yWi4eelyn7MZuH7J13PK1XUd5ejyHvH6Q56jBhuUQwhvSCZR6RsQGgpWU5d2V7FwjkX9w7cxxGH1zt5VxxtOHPyXIofUCIiOheXtXjUJtA3Mqrr/fDSouYE7oB10uWMK88Aw==', 'base64')).toString();

  return hook;
};
