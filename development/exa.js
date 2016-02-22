"use strict";
/** Requires */
import _ from 'lodash';
import methods from 'methods';

/** Helps */
/**
 * Проверка на промис
 * @param  {Any}  func
 * 
 * @return {Boolean}
 */
function isPromise(func) {
  try {
    return (!!func.then && typeof func.then === 'function') 
      || (!!func.catch && typeof func.catch === 'function');
  } catch(e) {
    return false;
  }
}

/**
 * Оборачивает все колбеки в прокси
 * @param  {Array} callbacks
 * 
 * @return {Array}
 */
function proxysify(callbacks) {
  return callbacks.map((callback) => {
    const _callback = callback;

    let result;
    switch (_callback.length) {
      case 4:
        callback = function (err, req, res, next) {
          result = _callback(err, req, res, next);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        }
        break;
      case 3:
        callback = function (req, res, next) {
          result = _callback(req, res, next);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        }
        break;
      case 2:
      default:
        callback = function (req, res, next) {
          result = _callback(req, res);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        }
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
export default function exa(router, options) {
  options = _.merge({
    prefix: "$",
    suffix: "",
    name: {}
  }, options);

  // Use
  ['use'].forEach((method) => {
    if (router[method]) {
      const newMethodName = options.name[method]
                          ? options.name[method]
                          : method

      const $method = options.prefix + newMethodName + options.suffix;

      router[$method] = function (...callbacks) {
        // Proxy
        callbacks = proxysify(callbacks);

        router[method](...callbacks);
      };
    }
  });

  // Other
  methods.concat('all').forEach((method) => {
    if (router[method]) {
      const $method = options.prefix + method + options.suffix;

      router[$method] = function (path) {
        let callbacks = Array.prototype.slice.call(arguments, 1);

        // Proxy
        callbacks = proxysify(callbacks);

        const args = [path].concat(callbacks);

        router[method](...args);
      };
    }
  });

  return router;
}
