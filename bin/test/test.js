"use strict";
/* global it, describe */
/** Requires */

require('babel-polyfill');

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _exa = require('../exa');

var _exa2 = _interopRequireDefault(_exa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/** Helps */
function memLatency(ms, res) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(res);
    }, ms);
  });
}

/** Tests */
describe('Mixed `app`', function () {
  describe('middleware', function () {
    describe('should works with `async/await`', function () {
      var app = (0, _exa2.default)((0, _express2.default)());
      var agent = _supertest2.default.agent(app);

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res, next) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  /*eslint-enable arrow-parens */
                  res.calls = [];
                  next();

                case 2:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, undefined);
        })),
            _this = undefined;

        return function (_x, _x2, _x3) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return memLatency(100, 'one');

                case 2:
                  item = _context2.sent;

                  res.calls.push(item);
                  next();

                case 5:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, undefined);
        })),
            _this = undefined;

        return function (_x4, _x5, _x6) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return memLatency(100, 'two');

                case 2:
                  item = _context3.sent;

                  res.calls.push(item);
                  next();

                case 5:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, undefined);
        })),
            _this = undefined;

        return function (_x7, _x8, _x9) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return memLatency(100);

                case 2:

                  res.send(res.calls);

                case 3:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, undefined);
        })),
            _this = undefined;

        return function (_x10, _x11) {
          return ref.apply(_this, arguments);
        };
      }());

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect('Content-Type', /json/).expect(200).end(function (err, res) {
          if (err) {
            throw err;
          }

          _assert2.default.deepEqual(res.body, ['one', 'two']);

          done();
        });
      });
    });
    describe('should works without `async/await`', function () {
      var app = (0, _exa2.default)((0, _express2.default)());
      var agent = _supertest2.default.agent(app);

      app.$use(function (req, res, next) {
        res.calls = [];
        next();
      });

      app.$use(function (req, res, next) {
        var item = 'one';
        res.calls.push(item);
        next();
      });

      app.$use(function (req, res, next) {
        var item = 'two';
        res.calls.push(item);
        next();
      });

      app.$use(function (req, res) {
        res.send(res.calls);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect('Content-Type', /json/).expect(200).end(function (err, res) {
          if (err) {
            throw err;
          }

          _assert2.default.deepEqual(res.body, ['one', 'two']);

          done();
        });
      });
    });
  });
  describe('POST / GET', function () {
    describe('should works with `async/await`', function () {
      var app = (0, _exa2.default)((0, _express2.default)());
      var agent = _supertest2.default.agent(app);

      /*eslint-disable arrow-parens */
      app.$get("/", function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res) {
          var text;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return memLatency(100, 'hello exa!');

                case 2:
                  text = _context5.sent;


                  res.send(text);

                case 4:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, undefined);
        })),
            _this = undefined;

        return function (_x12, _x13) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$post("/", function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(req, res) {
          var text;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return memLatency(100, 'hello post!');

                case 2:
                  text = _context6.sent;


                  res.send(text);

                case 4:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, undefined);
        })),
            _this = undefined;

        return function (_x14, _x15) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$get("/:text", function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(req, res) {
          var text;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return memLatency(100, 'hello ' + req.params.text + '!');

                case 2:
                  text = _context7.sent;


                  res.send(text);

                case 4:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, undefined);
        })),
            _this = undefined;

        return function (_x16, _x17) {
          return ref.apply(_this, arguments);
        };
      }());

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect('hello exa!').expect(200).end(done);
      });

      it('GET /world', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/world').expect('hello world!').expect(200).end(done);
      });

      it('POST /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.post('/').expect('hello post!').expect(200).end(done);
      });
    });

    describe('should works without `async/await`', function () {
      var app = (0, _exa2.default)((0, _express2.default)());
      var agent = _supertest2.default.agent(app);

      app.$get("/", function (req, res) {
        var text = 'hello exa!';

        res.send(text);
      });

      app.$post("/", function (req, res) {
        var text = 'hello post!';

        res.send(text);
      });

      app.$get("/:text", function (req, res) {
        var text = 'hello ' + req.params.text + '!';

        res.send(text);
      });

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect('hello exa!').expect(200).end(done);
      });

      it('GET /world', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/world').expect('hello world!').expect(200).end(done);
      });

      it('POST /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.post('/').expect('hello post!').expect(200).end(done);
      });
    });
  });
});

describe('Wrap callbacks with `exa.wrap`', function () {
  describe('middleware', function () {
    var app = (0, _express2.default)();
    var agent = _supertest2.default.agent(app);

    app.use(function (req, res, next) {
      res.calls = [];
      next();
    });

    /*eslint-disable arrow-parens */
    app.use(_exa2.default.wrap(function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(req, res, next) {
        var item;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return memLatency(100, 'one');

              case 2:
                item = _context8.sent;

                res.calls.push(item);
                next();

              case 5:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, undefined);
      })),
          _this = undefined;

      return function (_x18, _x19, _x20) {
        return ref.apply(_this, arguments);
      };
    }()));

    app.use(function (req, res, next) {
      var item = 'two';
      res.calls.push(item);
      next();
    });

    /*eslint-disable arrow-parens */
    app.use(_exa2.default.wrap(function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(req, res) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return memLatency(100);

              case 2:

                res.send(res.calls);

              case 3:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, undefined);
      })),
          _this = undefined;

      return function (_x21, _x22) {
        return ref.apply(_this, arguments);
      };
    }()));

    it('GET /', function (done) {
      this.timeout(5000);
      this.slow(1000);

      agent.get('/').expect('Content-Type', /json/).expect(200).end(function (err, res) {
        if (err) {
          throw err;
        }

        _assert2.default.deepEqual(res.body, ['one', 'two']);

        done();
      });
    });
  });

  describe('POST / GET', function () {
    var app = (0, _express2.default)();
    var agent = _supertest2.default.agent(app);

    /*eslint-disable arrow-parens */
    app.get("/", _exa2.default.wrap(function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(req, res) {
        var text;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return memLatency(100, 'hello exa!');

              case 2:
                text = _context10.sent;


                res.send(text);

              case 4:
              case 'end':
                return _context10.stop();
            }
          }
        }, _callee10, undefined);
      })),
          _this = undefined;

      return function (_x23, _x24) {
        return ref.apply(_this, arguments);
      };
    }()));

    /*eslint-disable arrow-parens */
    app.post("/", _exa2.default.wrap(function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(req, res) {
        var text;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return memLatency(100, 'hello post!');

              case 2:
                text = _context11.sent;


                res.send(text);

              case 4:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, undefined);
      })),
          _this = undefined;

      return function (_x25, _x26) {
        return ref.apply(_this, arguments);
      };
    }()));

    /*eslint-disable arrow-parens */
    app.get("/:text", _exa2.default.wrap(function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(req, res) {
        var text;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return memLatency(100, 'hello ' + req.params.text + '!');

              case 2:
                text = _context12.sent;


                res.send(text);

              case 4:
              case 'end':
                return _context12.stop();
            }
          }
        }, _callee12, undefined);
      })),
          _this = undefined;

      return function (_x27, _x28) {
        return ref.apply(_this, arguments);
      };
    }()));

    it('GET /', function (done) {
      this.timeout(5000);
      this.slow(1000);

      agent.get('/').expect('hello exa!').expect(200).end(done);
    });

    it('GET /world', function (done) {
      this.timeout(5000);
      this.slow(1000);

      agent.get('/world').expect('hello world!').expect(200).end(done);
    });

    it('POST /', function (done) {
      this.timeout(5000);
      this.slow(1000);

      agent.post('/').expect('hello post!').expect(200).end(done);
    });
  });
});