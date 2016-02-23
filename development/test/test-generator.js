"use strict";
/* global it, describe */
/** Requires */
import 'babel-polyfill';
import request  from 'supertest';
import assert   from 'assert';
import express  from 'express';
import methods  from 'methods';

import exa      from '../exa';

/** Helps */
/**
 * Проверка находится ли элемент в массиве
 * @param  {Any}    item
 * @param  {Array}  arr
 *
 * @return {Boolean}
 */
function inArray(item, arr) {
  return !!(arr.indexOf(item) >= 0);
}

/**
 * Псевдо задержка для проверки. Может вернуть любое значение в промисе.
 * @param  {Number} ms
 * @param  {Any}    res
 *
 * @return {Promise}
 */
function memLatency(ms, res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res);
    }, ms);
  });
}

/** Constants */
const validMethods = methods.filter((method) =>
  !inArray(method, ['connect', 'head']));

/** Tests */
describe('Mixed `app`', () => {
  describe('middleware', () => {
    describe('should works with generator', () => {
      const app = exa(express());
      const agent = request.agent(app);

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        const item = yield memLatency(5, 'one');
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        const item = yield memLatency(5, 'two');
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res) {
        /*eslint-enable arrow-parens */
        yield memLatency(5);

        res.send(res.calls);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            assert.deepEqual(res.body, ['one', 'two']);

            done();
          });
      });
    });

    describe('should catch errors with generator', () => {
      const app = exa(express());
      const agent = request.agent(app);

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        const item = yield memLatency(5, 'one');
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        const item = yield memLatency(5, 'two');

        throw new Error("Booom!!!");

        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (req, res) {
        /*eslint-enable arrow-parens */
        yield memLatency(5);

        res.send(res.calls);
      });

      /*eslint-disable arrow-parens */
      app.$use(function * (err, req, res, next) {
        /*eslint-enable arrow-parens */
        yield memLatency(5);

        res.status(500);
        res.send(err.message);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect("Booom!!!")
          .expect(500)
          .end(done);
      });
    });

    describe('should works without generator', () => {
      const app = exa(express());
      const agent = request.agent(app);

      app.$use((req, res, next) => {
        res.calls = [];
        next();
      });

      app.$use((req, res, next) => {
        const item = 'one';
        res.calls.push(item);
        next();
      });

      app.$use((req, res, next) => {
        const item = 'two';
        res.calls.push(item);
        next();
      });

      app.$use((req, res) => {
        res.send(res.calls);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            assert.deepEqual(res.body, ['one', 'two']);

            done();
          });
      });
    });
  });

  describe('methods', () => {
    describe('should works with generator', () => {
      validMethods.forEach((method) => {
        const app = exa(express());
        const agent = request.agent(app);

        const prefix = "$";

        /*eslint-disable arrow-parens */
        app[prefix + method]("/", function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${method}!`);

          res.send(text);
        });

        /*eslint-disable arrow-parens */
        app[prefix + method]("/:text", function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${req.params.text}!`);

          res.send(text);
        });

        it(`${method.toUpperCase()} /`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/')
            .expect(`hello ${method}!`)
            .expect(200)
            .end(done);
        });

        it(`${method.toUpperCase()} /world`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world')
            .expect('hello world!')
            .expect(200)
            .end(done);
        });
      });
    });

    describe('should catch errors with generator', () => {
      validMethods.forEach((method) => {
        const app = exa(express());
        const agent = request.agent(app);

        const prefix = "$";

        /*eslint-disable arrow-parens */
        app[prefix + method]("/", function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${method}!`);

          throw new Error(`bye ${method}!`);

          res.send(text);
        });

        /*eslint-disable arrow-parens */
        app[prefix + method]("/:text", function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${req.params.text}!`);

          throw new Error(`bye ${req.params.text}!`);

          res.send(text);
        });

        /*eslint-disable arrow-parens */
        app.$use(function * (err, req, res, next) {
          /*eslint-enable arrow-parens */
          yield memLatency(5);

          res.status(500);
          res.send(err.message);
        });

        it(`${method.toUpperCase()} /`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/')
            .expect(`bye ${method}!`)
            .expect(500)
            .end(done);
        });

        it(`${method.toUpperCase()} /world`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world')
            .expect('bye world!')
            .expect(500)
            .end(done);
        });
      });
    });

    describe('should works without generator', () => {
      validMethods.forEach((method) => {
        const app = exa(express());
        const agent = request.agent(app);

        const prefix = "$";

        app[prefix + method]("/", (req, res) => {
          const text = `hello ${method}!`;

          res.send(text);
        });

        app[prefix + method]("/:text", (req, res) => {
          const text = `hello ${req.params.text}!`;

          res.send(text);
        });

        it(`${method.toUpperCase()} /`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/')
            .expect(`hello ${method}!`)
            .expect(200)
            .end(done);
        });

        it(`${method.toUpperCase()} /world`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world')
            .expect('hello world!')
            .expect(200)
            .end(done);
        });
      });
    });
  });
});

describe('Wrap callbacks with `exa.wrap`', () => {
  describe('middleware', () => {
    describe('should works with generator', () => {
      const app = express();
      const agent = request.agent(app);

      app.use((req, res, next) => {
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(exa.wrap(function * (req, res, next) {
        /*eslint-enable arrow-parens */

        const item = yield memLatency(5, 'one');
        res.calls.push(item);
        next();
      }));

      app.use((req, res, next) => {
        const item = 'two';
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(exa.wrap(function * (req, res) {
        /*eslint-enable arrow-parens */

        yield memLatency(5);

        res.send(res.calls);
      }));

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            assert.deepEqual(res.body, ['one', 'two']);

            done();
          });
      });
    });

    describe('should catch errors with generator', () => {
      const app = express();
      const agent = request.agent(app);

      app.use((req, res, next) => {
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(exa.wrap(function * (req, res, next) {
        /*eslint-enable arrow-parens */
        const item = yield memLatency(5, 'one');

        throw new Error("Booom!!!");

        res.calls.push(item);
        next();
      }));

      app.use((req, res, next) => {
        const item = 'two';
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(exa.wrap(function * (req, res) {
        /*eslint-enable arrow-parens */

        yield memLatency(5);

        res.send(res.calls);
      }));

      /*eslint-disable arrow-parens */
      app.use(exa.wrap(function * (err, req, res, next) {
        /*eslint-enable arrow-parens */
        yield memLatency(5);

        res.status(500);
        res.send(err.message);
      }));

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect("Booom!!!")
          .expect(500)
          .end(done);
      });
    });
  });

  describe('methods', () => {
    describe('should works with generator', () => {
      validMethods.forEach((method) => {
        const app = express();
        const agent = request.agent(app);

        /*eslint-disable arrow-parens */
        app[method]("/", exa.wrap(function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${method}!`);

          res.send(text);
        }));

        /*eslint-disable arrow-parens */
        app[method]("/:text", exa.wrap(function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${req.params.text}!`);

          res.send(text);
        }));

        it(`${method.toUpperCase()} /`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/')
            .expect(`hello ${method}!`)
            .expect(200)
            .end(done);
        });

        it(`${method.toUpperCase()} /world`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world')
            .expect('hello world!')
            .expect(200)
            .end(done);
        });
      });
    });

    describe('should catch errors with generator', () => {
      validMethods.forEach((method) => {
        const app = express();
        const agent = request.agent(app);

        /*eslint-disable arrow-parens */
        app[method]("/", exa.wrap(function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${method}!`);

          throw new Error(`bye ${method}!`);

          res.send(text);
        }));

        /*eslint-disable arrow-parens */
        app[method]("/:text", exa.wrap(function * (req, res) {
          /*eslint-enable arrow-parens */
          const text = yield memLatency(5, `hello ${req.params.text}!`);

          throw new Error(`bye ${req.params.text}!`);

          res.send(text);
        }));

        /*eslint-disable arrow-parens */
        app.use(exa.wrap(function * (err, req, res, next) {
          /*eslint-enable arrow-parens */
          yield memLatency(5);

          res.status(500);
          res.send(err.message);
        }));

        it(`${method.toUpperCase()} /`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/')
            .expect(`bye ${method}!`)
            .expect(500)
            .end(done);
        });

        it(`${method.toUpperCase()} /world`, function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world')
            .expect('bye world!')
            .expect(500)
            .end(done);
        });
      });
    });
  });
});
