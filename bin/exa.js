"use strict";
/** Requires */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exa;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _methods = require('methods');

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** Helps */
var slice = Array.prototype.slice;

/**
 * Проверка на промис
 * @param  {Any}  obj
 *
 * @return {Boolean}
 */
function isPromise(obj) {
  return !!obj && obj.constructor && obj.constructor.name === 'Promise' || !!obj.then && typeof obj.then === 'function' || !!obj.catch && typeof obj.catch === 'function';
}

/**
 * Оборачивает все колбеки в прокси
 * @param  {Array} callbacks
 *
 * @return {Array}
 */
function proxyCallbacks(callbacks) {
  return callbacks.map(function (callback) {
    var _callback = callback;

    var result = undefined;
    switch (callback.length) {
      case 4:
        callback = function callback(err, req, res, next) {
          result = _callback(err, req, res, next);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        };
        break;
      case 3:
        callback = function callback(req, res, next) {
          result = _callback(req, res, next);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        };
        break;
      case 2:
      default:
        callback = function callback(req, res, next) {
          result = _callback(req, res);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        };
        break;
    }

    return callback;
  });
}

/**
 * Примешивает Async/Await к Express
 * @param  {Express|Router} router
 * @param  {Object} options
 *
 * @return {Express|Router}
 */
function exa(router, options) {
  options = _lodash2.default.merge({
    prefix: "$",
    suffix: "",
    alias: {}
  }, options);

  // Use
  ['use'].forEach(function (method) {
    if (router[method]) {
      var newMethodName = options.alias[method] ? options.alias[method] : method;

      var $method = options.prefix + newMethodName + options.suffix;

      router[$method] = function () {
        for (var _len = arguments.length, callbacks = Array(_len), _key = 0; _key < _len; _key++) {
          callbacks[_key] = arguments[_key];
        }

        // Proxy
        callbacks = proxyCallbacks(callbacks);

        router[method].apply(router, _toConsumableArray(callbacks));
      };
    }
  });

  // Other
  [].concat(_toConsumableArray(_methods2.default), ['all']).forEach(function (method) {
    if (router[method]) {
      var $method = options.prefix + method + options.suffix;

      router[$method] = function (path) {
        var callbacks = slice.call(arguments, 1);

        // Proxy
        callbacks = proxyCallbacks(callbacks);

        var args = [path].concat(_toConsumableArray(callbacks));

        router[method].apply(router, _toConsumableArray(args));
      };
    }
  });

  return router;
}
module.exports = exports['default'];