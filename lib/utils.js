'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isArray = isArray;
exports.isArrayOfStrings = isArrayOfStrings;
exports.putInArrayIfNotAlready = putInArrayIfNotAlready;
exports.zipObj = zipObj;
exports.setProp = setProp;
exports.extend = extend;
exports.startWithOn = startWithOn;
exports.startWithOnEndWithSync = startWithOnEndWithSync;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//var utils = {};

function isObject(obj) {
  return !!obj && (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && !isArray(obj) && !isFunction(obj);
}
function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function isArray(value) {
  return Array.isArray(value);
}
function isArrayOfStrings(value) {
  return isArray(value) && value.every(isString);
}

function putInArrayIfNotAlready(value) {
  return isArray(value) ? value : [value];
}

function zipObj(keys, vals) {
  var o = {};
  var i = 0;
  for (; i < keys.length; i++) {
    o[keys[i]] = vals[i];
  }
  return o;
}

function setProp(obj, source, prop) {
  if (_getOwnPropertyDescriptor2.default && _defineProperty2.default) {
    var propertyDescriptor = (0, _getOwnPropertyDescriptor2.default)(source, prop);
    (0, _defineProperty2.default)(obj, prop, propertyDescriptor);
  } else {
    obj[prop] = source[prop];
  }
  return obj;
}

function extend(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  //var source, prop;
  var source = void 0;
  var keys = void 0;
  var prop = void 0;

  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  for (var i = 0, length = rest.length; i < length; i++) {
    source = rest[i];
    keys = (0, _keys2.default)(source);
    for (var j = 0; j < keys.length; j++) {
      prop = keys[j];
      obj = setProp(obj, source, prop);
    }
  }
  return obj;
}

function startWithOn(str) {
  return str.length >= 3 && str.slice(0, 2) === 'on' && str[2].toUpperCase() === str[2];
}

function startWithOnEndWithSync(str) {
  return str.length >= 7 && startWithOn(str) && str.slice(-4) === 'Sync';
}

//module.exports = utils;