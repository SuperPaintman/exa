# exa

[![Linux Build][travis-image]][travis-url]
[![Windows Build][appveyor-image]][appveyor-url]
[![NPM version][npm-v-image]][npm-url]
[![NPM Downloads][npm-dm-image]][npm-url]
[![Test Coverage][coveralls-image]][coveralls-url]

ES7 async/await route handlers for Express


## Installation
```sh
npm install exa --save
```

--------------------------------------------------------------------------------

## Usage
```js
import exa      from 'exa'; 
import express  from 'express';

const app = exa(express());

// Mem delay
function work(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

app.$get("/", async (req, res) => {
  console.log('wow!');
  await work(3000);
  console.log('so async!');

  res.send('ES7 soooo cool!');
});

app.$get("/error", async (req, res) => {
  throw new Error("Booom!!!");

  res.send('I will never show :(');
});

app.$post("/sync", (req, res) => {
  res.send('I\'m sync? ^__^');
});

app.$use(async (err, req, res, next) => {
  console.error(err);

  console.log("Start working");
  await work(3000);
  console.log("Finish working");

  res.statusStatus(500);
});
```

--------------------------------------------------------------------------------

## API

--------------------------------------------------------------------------------

## Changelog

--------------------------------------------------------------------------------

## License
Copyright (c)  2016 [Alexander Krivoshhekov][github-author-link]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[github-author-link]: http://github.com/SuperPaintman
[npm-url]: https://www.npmjs.com/package/exa
[npm-v-image]: https://img.shields.io/npm/v/exa.svg
[npm-dm-image]: https://img.shields.io/npm/dm/exa.svg
[travis-image]: https://img.shields.io/travis/SuperPaintman/exa/master.svg?label=linux
[travis-url]: https://travis-ci.org/SuperPaintman/exa
[appveyor-image]: https://img.shields.io/appveyor/ci/SuperPaintman/exa/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/SuperPaintman/exa
[coveralls-image]: https://img.shields.io/coveralls/SuperPaintman/exa/master.svg
[coveralls-url]: https://coveralls.io/r/SuperPaintman/exa?branch=master
