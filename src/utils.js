//var utils = {};

export function isObject(obj) {
  return !!obj && (typeof obj === 'object') && !isArray(obj) && !isFunction(obj);
}
export function isFunction(value) {
  return typeof value === 'function';
}
export function isString(value) {
  return typeof value === 'string';
}
export function isArray(value) {
  return Array.isArray(value);
}
export function isArrayOfStrings(value) {
  return isArray(value) && value.every(isString);
}

export function putInArrayIfNotAlready(value) {
  return isArray(value) ? value : [value];
}


export function zipObj(keys, vals) {
  let o = {};
  let i = 0;
  for (; i < keys.length; i++) {
    o[keys[i]] = vals[i];
  }
  return o;
}

export function setProp(obj, source, prop) {
  if (Object.getOwnPropertyDescriptor && Object.defineProperty) {
    let propertyDescriptor = Object.getOwnPropertyDescriptor(source, prop);
    Object.defineProperty(obj, prop, propertyDescriptor);
  } else {
    obj[prop] = source[prop];
  }
  return obj;
}

export function extend(obj, ...rest) {
  if (!isObject(obj)) {
    return obj;
  }
  //var source, prop;
  let source;
  let keys;
  let prop;
  for (let i = 0, length = rest.length; i < length; i++) {
    source = rest[i];
    keys = Object.keys(source);
    for (let j = 0; j < keys.length; j++) {
      prop = keys[j];
      obj = setProp(obj, source, prop);
    }
  }
  return obj;
}

export function startWithOn(str) {
  return str.length >= 3 && str.slice(0, 2) === 'on' && str[2].toUpperCase() === str[2];
}

export function startWithOnEndWithSync(str) {
  return str.length >= 7 && startWithOn(str) && str.slice(-4) === 'Sync';
}

//module.exports = utils;
