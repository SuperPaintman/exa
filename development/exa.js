"use strict";
/** Requires */
import _        from 'lodash';
import methods  from 'methods';

/** Helps */
const slice = Array.prototype.slice;

/**
 * Проверка на промис
 * @param  {Any}  obj
 * 
 * @return {Boolean}
 */
function isPromise(obj) {
  return !!obj 
    && (obj.constructor && obj.constructor.name === 'Promise') 
    || (!!obj.then  && typeof obj.then  === 'function') 
    || (!!obj.catch && typeof obj.catch === 'function');
}

/**
 * Оборачивает все колбеки в прокси
 * @param  {Array} callbacks
 * 
 * @return {Array}
 */
function proxyCallbacks(callbacks) {
  return callbacks.map((callback) => {
    const _callback = callback;

    let result;
    switch (callback.length) {
      case 4:
        callback = function (err, req, res, next) {
          result = _callback(err, req, res, next);

          if (isPromise(result)) {
            result.catch(function (err) {
              next(err);
            });
          }
        };
        break;
      case 3:
        callback = function (req, res, next) {
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
        callback = function (req, res, next) {
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
export default function exa(router, options) {
  options = _.merge({
    prefix: "$",
    suffix: "",
    alias: {}
  }, options);

  // Use
  ['use'].forEach((method) => {
    if (router[method]) {
      const newMethodName = options.name[method]
                          ? options.name[method]
                          : method;

      const $method = options.prefix + newMethodName + options.suffix;

      router[$method] = function (...callbacks) {
        // Proxy
        callbacks = proxyCallbacks(callbacks);

        router[method](...callbacks);
      };
    }
  });

  // Other
  [...methods, 'all'].forEach((method) => {
    if (router[method]) {
      const $method = options.prefix + method + options.suffix;

      router[$method] = function (path) {
        let callbacks = slice.call(arguments, 1);

        // Proxy
        callbacks = proxyCallbacks(callbacks);

        const args = [...callbacks, path];

        router[method](...args);
      };
    }
  });

  return router;
}
