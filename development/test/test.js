"use strict";
/* global it, describe */
/** Requires */
import 'babel-polyfill';
import request  from 'supertest';
import assert   from 'assert';
import express  from 'express';

import exa      from '../exa';

/** Helps */
function memLatency(ms, res) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(res);
    }, ms);
  });
}

/** Tests */
describe('Mixed "app"', () => {
  describe('middleware', () => {
    describe('should works with `async/await`', () => {
      const app = exa(express());
      const agent = request.agent(app);

      /*eslint-disable arrow-parens */
      app.$use(async (req, res, next) => {
        /*eslint-enable arrow-parens */
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(async (req, res, next) => {
        /*eslint-enable arrow-parens */
        const item = await memLatency(100, 'one');
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(async (req, res, next) => {
        /*eslint-enable arrow-parens */
        const item = await memLatency(100, 'two');
        res.calls.push(item);
        next();
      });

      /*eslint-disable arrow-parens */
      app.$use(async (req, res) => {
        /*eslint-enable arrow-parens */
        await memLatency(100);

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
    describe('should works without `async/await`', () => {
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
  describe('POST / GET', () => {
    describe('should works with `async/await`', () => {
      const app = exa(express());
      const agent = request.agent(app);

      /*eslint-disable arrow-parens */
      app.$get("/", async (req, res) => {
        /*eslint-enable arrow-parens */
        const text = await memLatency(100, 'hello exa!');

        res.send(text);
      });

      /*eslint-disable arrow-parens */
      app.$post("/", async (req, res) => {
        /*eslint-enable arrow-parens */
        const text = await memLatency(100, 'hello post!');

        res.send(text);
      });

      /*eslint-disable arrow-parens */
      app.$get("/:text", async (req, res) => {
        /*eslint-enable arrow-parens */
        const text = await memLatency(100, `hello ${req.params.text}!`);

        res.send(text);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect('hello exa!')
          .expect(200)
          .end(done);
      });

      it('GET /world', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/world')
          .expect('hello world!')
          .expect(200)
          .end(done);
      });

      it('POST /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .post('/')
          .expect('hello post!')
          .expect(200)
          .end(done);
      });
    });

    describe('should works without `async/await`', () => {
      const app = exa(express());
      const agent = request.agent(app);

      app.$get("/", (req, res) => {
        const text = 'hello exa!';

        res.send(text);
      });

      app.$post("/", (req, res) => {
        const text = 'hello post!';

        res.send(text);
      });

      app.$get("/:text", (req, res) => {
        const text = `hello ${req.params.text}!`;

        res.send(text);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/')
          .expect('hello exa!')
          .expect(200)
          .end(done);
      });

      it('GET /world', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .get('/world')
          .expect('hello world!')
          .expect(200)
          .end(done);
      });

      it('POST /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent
          .post('/')
          .expect('hello post!')
          .expect(200)
          .end(done);
      });
    });
  });
});
