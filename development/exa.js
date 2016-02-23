"use strict";
/** Requires */
import _        from 'lodash';
import co       from 'co';
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
  if (!obj || !obj.constructor) {
    return false;
  }

  if (obj.constructor.name === 'Promise'
    || obj.constructor.displayName === 'Promise') {
    return true;
  }

  return (typeof obj.then === 'function' || typeof obj.catch === 'function');
}

/**
 * Проверка является ли функция генератором
 * @param {Any} obj
 *
 * @return {Boolean}
 */
function isGeneratorFunction(obj) {
  if (!obj || !obj.constructor) {
    return false;
  }

  if (obj.constructor.name === 'GeneratorFunction'
    || obj.constructor.displayName === 'GeneratorFunction') {
    return true;
  }

  return (typeof obj.next === 'function' && typeof obj.throw === 'function');
}

/**
 * Оборачивает один колбек в прокси
 * @param  {Function} callbacks
 *
 * @return {Array}
 */
function wrapCallback(callback) {
  const argsLength = callback.length;

  let _callback = callback;

  /** Если функция - генератор, оборачиваем ее как промис через CO */
  if (isGeneratorFunction(_callback)) {
    _callback = co.wrap(_callback);
  }

  let result;
  switch (argsLength) {
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
}

/**
 * Оборачивает все колбеки в прокси
 * @param  {Array} callbacks
 *
 * @return {Array}
 */
function wrapCallbacks(callbacks) {
  return callbacks.map((callback) => wrapCallback(callback));
}

/**
 * Примешивает Async/Await к Express
 * @param  {Express|Router} router
 * @param  {Object} options
 *
 * @return {Express|Router}
 */
function exa(router, options) {
  options = _.merge({
    prefix: "$",
    suffix: "",
    alias: {}
  }, options);

  // Use
  ['use'].forEach((method) => {
    if (router[method]) {
      const newMethodName = options.alias[method]
                          ? options.alias[method]
                          : method;

      const $method = options.prefix + newMethodName + options.suffix;

      router[$method] = function (...callbacks) {
        // Proxy
        callbacks = wrapCallbacks(callbacks);

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
        callbacks = wrapCallbacks(callbacks);

        const args = [path, ...callbacks];

        router[method](...args);
      };
    }
  });

  return router;
}

exa.wrap = wrapCallback;

export default exa;
