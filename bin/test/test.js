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

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

var _exa = require('../exa');

var _exa2 = _interopRequireDefault(_exa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(res);
    }, ms);
  });
}

/** Constants */
var validMethods = _methods2.default.filter(function (method) {
  return !inArray(method, ['connect', 'head']);
});

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
                  return memLatency(5, 'one');

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
                  return memLatency(5, 'two');

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
                  return memLatency(5);

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

    describe('should catch errors with `async/await`', function () {
      var app = (0, _exa2.default)((0, _express2.default)());
      var agent = _supertest2.default.agent(app);

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res, next) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  /*eslint-enable arrow-parens */
                  res.calls = [];
                  next();

                case 2:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, undefined);
        })),
            _this = undefined;

        return function (_x12, _x13, _x14) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return memLatency(5, 'one');

                case 2:
                  item = _context6.sent;

                  res.calls.push(item);
                  next();

                case 5:
                case 'end':
                  return _context6.stop();
              }
            }
          }, _callee6, undefined);
        })),
            _this = undefined;

        return function (_x15, _x16, _x17) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return memLatency(5, 'two');

                case 2:
                  item = _context7.sent;
                  throw new Error("Booom!!!");

                case 6:
                case 'end':
                  return _context7.stop();
              }
            }
          }, _callee7, undefined);
        })),
            _this = undefined;

        return function (_x18, _x19, _x20) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(req, res) {
          return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return memLatency(5);

                case 2:

                  res.send(res.calls);

                case 3:
                case 'end':
                  return _context8.stop();
              }
            }
          }, _callee8, undefined);
        })),
            _this = undefined;

        return function (_x21, _x22) {
          return ref.apply(_this, arguments);
        };
      }());

      /*eslint-disable arrow-parens */
      app.$use(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(err, req, res, next) {
          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return memLatency(5);

                case 2:

                  res.status(500);
                  res.send(err.message);

                case 4:
                case 'end':
                  return _context9.stop();
              }
            }
          }, _callee9, undefined);
        })),
            _this = undefined;

        return function (_x23, _x24, _x25, _x26) {
          return ref.apply(_this, arguments);
        };
      }());

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect("Booom!!!").expect(500).end(done);
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

  describe('methods', function () {
    describe('should works with `async/await`', function () {
      validMethods.forEach(function (method) {
        var app = (0, _exa2.default)((0, _express2.default)());
        var agent = _supertest2.default.agent(app);

        var prefix = "$";

        /*eslint-disable arrow-parens */
        app[prefix + method]("/", function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
                    return memLatency(5, 'hello ' + method + '!');

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

          return function (_x27, _x28) {
            return ref.apply(_this, arguments);
          };
        }());

        /*eslint-disable arrow-parens */
        app[prefix + method]("/:text", function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
              while (1) {
                switch (_context11.prev = _context11.next) {
                  case 0:
                    _context11.next = 2;
                    return memLatency(5, 'hello ' + req.params.text + '!');

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

          return function (_x29, _x30) {
            return ref.apply(_this, arguments);
          };
        }());

        it(method.toUpperCase() + ' /', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/').expect('hello ' + method + '!').expect(200).end(done);
        });

        it(method.toUpperCase() + ' /world', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world').expect('hello world!').expect(200).end(done);
        });
      });
    });

    describe('should catch errors with `async/await`', function () {
      validMethods.forEach(function (method) {
        var app = (0, _exa2.default)((0, _express2.default)());
        var agent = _supertest2.default.agent(app);

        var prefix = "$";

        /*eslint-disable arrow-parens */
        app[prefix + method]("/", function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    _context12.next = 2;
                    return memLatency(5, 'hello ' + method + '!');

                  case 2:
                    text = _context12.sent;
                    throw new Error('bye ' + method + '!');

                  case 5:
                  case 'end':
                    return _context12.stop();
                }
              }
            }, _callee12, undefined);
          })),
              _this = undefined;

          return function (_x31, _x32) {
            return ref.apply(_this, arguments);
          };
        }());

        /*eslint-disable arrow-parens */
        app[prefix + method]("/:text", function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee13(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    _context13.next = 2;
                    return memLatency(5, 'hello ' + req.params.text + '!');

                  case 2:
                    text = _context13.sent;
                    throw new Error('bye ' + req.params.text + '!');

                  case 5:
                  case 'end':
                    return _context13.stop();
                }
              }
            }, _callee13, undefined);
          })),
              _this = undefined;

          return function (_x33, _x34) {
            return ref.apply(_this, arguments);
          };
        }());

        /*eslint-disable arrow-parens */
        app.$use(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee14(err, req, res, next) {
            return regeneratorRuntime.wrap(function _callee14$(_context14) {
              while (1) {
                switch (_context14.prev = _context14.next) {
                  case 0:
                    _context14.next = 2;
                    return memLatency(5);

                  case 2:

                    res.status(500);
                    res.send(err.message);

                  case 4:
                  case 'end':
                    return _context14.stop();
                }
              }
            }, _callee14, undefined);
          })),
              _this = undefined;

          return function (_x35, _x36, _x37, _x38) {
            return ref.apply(_this, arguments);
          };
        }());

        it(method.toUpperCase() + ' /', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/').expect('bye ' + method + '!').expect(500).end(done);
        });

        it(method.toUpperCase() + ' /world', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world').expect('bye world!').expect(500).end(done);
        });
      });
    });

    describe('should works without `async/await`', function () {
      validMethods.forEach(function (method) {
        var app = (0, _exa2.default)((0, _express2.default)());
        var agent = _supertest2.default.agent(app);

        var prefix = "$";

        app[prefix + method]("/", function (req, res) {
          var text = 'hello ' + method + '!';

          res.send(text);
        });

        app[prefix + method]("/:text", function (req, res) {
          var text = 'hello ' + req.params.text + '!';

          res.send(text);
        });

        it(method.toUpperCase() + ' /', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/').expect('hello ' + method + '!').expect(200).end(done);
        });

        it(method.toUpperCase() + ' /world', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world').expect('hello world!').expect(200).end(done);
        });
      });
    });
  });
});

describe('Wrap callbacks with `exa.wrap`', function () {
  describe('middleware', function () {
    describe('should works with `async/await`', function () {
      var app = (0, _express2.default)();
      var agent = _supertest2.default.agent(app);

      app.use(function (req, res, next) {
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(_exa2.default.wrap(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee15(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee15$(_context15) {
            while (1) {
              switch (_context15.prev = _context15.next) {
                case 0:
                  _context15.next = 2;
                  return memLatency(5, 'one');

                case 2:
                  item = _context15.sent;

                  res.calls.push(item);
                  next();

                case 5:
                case 'end':
                  return _context15.stop();
              }
            }
          }, _callee15, undefined);
        })),
            _this = undefined;

        return function (_x39, _x40, _x41) {
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
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee16(req, res) {
          return regeneratorRuntime.wrap(function _callee16$(_context16) {
            while (1) {
              switch (_context16.prev = _context16.next) {
                case 0:
                  _context16.next = 2;
                  return memLatency(5);

                case 2:

                  res.send(res.calls);

                case 3:
                case 'end':
                  return _context16.stop();
              }
            }
          }, _callee16, undefined);
        })),
            _this = undefined;

        return function (_x42, _x43) {
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

    describe('should catch errors with `async/await`', function () {
      var app = (0, _express2.default)();
      var agent = _supertest2.default.agent(app);

      app.use(function (req, res, next) {
        res.calls = [];
        next();
      });

      /*eslint-disable arrow-parens */
      app.use(_exa2.default.wrap(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee17(req, res, next) {
          var item;
          return regeneratorRuntime.wrap(function _callee17$(_context17) {
            while (1) {
              switch (_context17.prev = _context17.next) {
                case 0:
                  _context17.next = 2;
                  return memLatency(5, 'one');

                case 2:
                  item = _context17.sent;
                  throw new Error("Booom!!!");

                case 6:
                case 'end':
                  return _context17.stop();
              }
            }
          }, _callee17, undefined);
        })),
            _this = undefined;

        return function (_x44, _x45, _x46) {
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
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee18(req, res) {
          return regeneratorRuntime.wrap(function _callee18$(_context18) {
            while (1) {
              switch (_context18.prev = _context18.next) {
                case 0:
                  _context18.next = 2;
                  return memLatency(5);

                case 2:

                  res.send(res.calls);

                case 3:
                case 'end':
                  return _context18.stop();
              }
            }
          }, _callee18, undefined);
        })),
            _this = undefined;

        return function (_x47, _x48) {
          return ref.apply(_this, arguments);
        };
      }()));

      /*eslint-disable arrow-parens */
      app.use(_exa2.default.wrap(function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee19(err, req, res, next) {
          return regeneratorRuntime.wrap(function _callee19$(_context19) {
            while (1) {
              switch (_context19.prev = _context19.next) {
                case 0:
                  _context19.next = 2;
                  return memLatency(5);

                case 2:

                  res.status(500);
                  res.send(err.message);

                case 4:
                case 'end':
                  return _context19.stop();
              }
            }
          }, _callee19, undefined);
        })),
            _this = undefined;

        return function (_x49, _x50, _x51, _x52) {
          return ref.apply(_this, arguments);
        };
      }()));

      it('GET /', function (done) {
        this.timeout(5000);
        this.slow(1000);

        agent.get('/').expect("Booom!!!").expect(500).end(done);
      });
    });
  });

  describe('methods', function () {
    describe('should works with `async/await`', function () {
      validMethods.forEach(function (method) {
        var app = (0, _express2.default)();
        var agent = _supertest2.default.agent(app);

        /*eslint-disable arrow-parens */
        app[method]("/", _exa2.default.wrap(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee20(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee20$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    _context20.next = 2;
                    return memLatency(5, 'hello ' + method + '!');

                  case 2:
                    text = _context20.sent;


                    res.send(text);

                  case 4:
                  case 'end':
                    return _context20.stop();
                }
              }
            }, _callee20, undefined);
          })),
              _this = undefined;

          return function (_x53, _x54) {
            return ref.apply(_this, arguments);
          };
        }()));

        /*eslint-disable arrow-parens */
        app[method]("/:text", _exa2.default.wrap(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee21(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee21$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    _context21.next = 2;
                    return memLatency(5, 'hello ' + req.params.text + '!');

                  case 2:
                    text = _context21.sent;


                    res.send(text);

                  case 4:
                  case 'end':
                    return _context21.stop();
                }
              }
            }, _callee21, undefined);
          })),
              _this = undefined;

          return function (_x55, _x56) {
            return ref.apply(_this, arguments);
          };
        }()));

        it(method.toUpperCase() + ' /', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/').expect('hello ' + method + '!').expect(200).end(done);
        });

        it(method.toUpperCase() + ' /world', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world').expect('hello world!').expect(200).end(done);
        });
      });
    });

    describe('should catch errors with `async/await`', function () {
      validMethods.forEach(function (method) {
        var app = (0, _express2.default)();
        var agent = _supertest2.default.agent(app);

        /*eslint-disable arrow-parens */
        app[method]("/", _exa2.default.wrap(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee22(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee22$(_context22) {
              while (1) {
                switch (_context22.prev = _context22.next) {
                  case 0:
                    _context22.next = 2;
                    return memLatency(5, 'hello ' + method + '!');

                  case 2:
                    text = _context22.sent;
                    throw new Error('bye ' + method + '!');

                  case 5:
                  case 'end':
                    return _context22.stop();
                }
              }
            }, _callee22, undefined);
          })),
              _this = undefined;

          return function (_x57, _x58) {
            return ref.apply(_this, arguments);
          };
        }()));

        /*eslint-disable arrow-parens */
        app[method]("/:text", _exa2.default.wrap(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee23(req, res) {
            var text;
            return regeneratorRuntime.wrap(function _callee23$(_context23) {
              while (1) {
                switch (_context23.prev = _context23.next) {
                  case 0:
                    _context23.next = 2;
                    return memLatency(5, 'hello ' + req.params.text + '!');

                  case 2:
                    text = _context23.sent;
                    throw new Error('bye ' + req.params.text + '!');

                  case 5:
                  case 'end':
                    return _context23.stop();
                }
              }
            }, _callee23, undefined);
          })),
              _this = undefined;

          return function (_x59, _x60) {
            return ref.apply(_this, arguments);
          };
        }()));

        /*eslint-disable arrow-parens */
        app.use(_exa2.default.wrap(function () {
          var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee24(err, req, res, next) {
            return regeneratorRuntime.wrap(function _callee24$(_context24) {
              while (1) {
                switch (_context24.prev = _context24.next) {
                  case 0:
                    _context24.next = 2;
                    return memLatency(5);

                  case 2:

                    res.status(500);
                    res.send(err.message);

                  case 4:
                  case 'end':
                    return _context24.stop();
                }
              }
            }, _callee24, undefined);
          })),
              _this = undefined;

          return function (_x61, _x62, _x63, _x64) {
            return ref.apply(_this, arguments);
          };
        }()));

        it(method.toUpperCase() + ' /', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/').expect('bye ' + method + '!').expect(500).end(done);
        });

        it(method.toUpperCase() + ' /world', function (done) {
          this.timeout(5000);
          this.slow(1000);

          agent[method]('/world').expect('bye world!').expect(500).end(done);
        });
      });
    });
  });
});