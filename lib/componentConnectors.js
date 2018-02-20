'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.connectMixin = connectMixin;
exports.updateConnects = updateConnects;
exports.createConnectDecorator = createConnectDecorator;

var _utils = require('./utils.js');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function keyValFromObjOrString(objOrStr) {
  return (0, _utils.isString)(objOrStr) ? { key: objOrStr, val: objOrStr } : { key: (0, _keys2.default)(objOrStr)[0], val: (0, _values2.default)(objOrStr)[0] };
}
var keyFromObjOrString = function keyFromObjOrString(key) {
  return keyValFromObjOrString(key).key;
};
var valFromObjOrString = function valFromObjOrString(key) {
  return keyValFromObjOrString(key).val;
};

/**
 *
 * @param state
 * @param stateProperty
 * @returns {object}
 */
function putStateInStateProperty(state, stateProperty) {
  return !stateProperty ? state : (0, _defineProperty3.default)({}, stateProperty, state);
}

var setStateFunc = function setStateFunc(componentInstance, newState, stateProperty) {
  //let newState = noKey ? state : zipObj([key], [state]);
  //if (typeof componentInstance.isMounted === "undefined" || componentInstance.isMounted() === true) {
  componentInstance.setState(putStateInStateProperty((0, _assign2.default)({}, newState), stateProperty));
  //}
};

var getInitialStateFunc = function getInitialStateFunc(store, keys, componentName) {
  if (!(0, _utils.isFunction)(store.getInitialState)) {
    console.warn( // eslint-disable-line no-console
    'component ' + componentName + ' is trying to connect to a store that lacks "getInitialState()" method');
    return {};
  } else {
    var storeState = (0, _assign2.default)({}, store.state);
    //return noKey ? storeState : storeState[key];
    if (!keys) {
      return storeState;
    } else {
      keys = (0, _utils.putInArrayIfNotAlready)(keys);

      return (0, _utils.zipObj)(keys.map(valFromObjOrString), keys.map(function (key) {
        return storeState[keyFromObjOrString(key)];
      }));
    }

    //return !keys ? storeState : zipObj(keys, keys.map(key => {return storeState[key]}));
  }
};

var subscribe = function subscribe(_this, store, keys, componentInstance, stateProperty, displayName) {
  var listeners = void 0;

  if (!keys) {
    listeners = [{ triggerer: store }];
  } else {
    keys = (0, _utils.putInArrayIfNotAlready)(keys);
    listeners = keys.map(function (key) {
      var triggerer = store[_constants.stateTriggers][keyFromObjOrString(key)];
      if (!triggerer) {
        console.warn( // eslint-disable-line no-console
        displayName + ' is trying to connect to store which was not initialized with: ' + key);
      }
      return {
        triggerer: triggerer,
        key: valFromObjOrString(key)
      };
    });
  }

  _this[_constants.unsubscribers] = _this[_constants.unsubscribers] || [];

  listeners.forEach(function (listener) {
    if (!listener.triggerer) {
      return;
    }
    _this[_constants.unsubscribers].push(listener.triggerer.listen(function (dataObj) {
      var newState = !listener.key ? dataObj : (0, _defineProperty3.default)({}, listener.key, dataObj);

      setStateFunc(componentInstance, newState, stateProperty);
    }));
  });
};

var unSubscribe = function unSubscribe(_this) {
  _this[_constants.unsubscribers].forEach(function (unsubscriber) {
    unsubscriber();
  });
};

/**
 *
 * @param {object} store - Cartiv store to be connected to its state
 * @param {{k:v}|string|[{k:v}|string]} keys - connect to a specific key in the state
 *  pass string - key in the store, rename it with object - {storeKey: newName}, or send a list of those
 * @param {string} stateProperty - set the store's state
 * @returns {object} - react-mixin
 */
function connectMixin(store, keys, stateProperty) {
  //let noKey = !keys;
  //let noStateProperty = !stateProperty;

  return {
    getInitialState: function getInitialState() {
      var initialState = getInitialStateFunc(store, keys, this.constructor.displayName);
      return putStateInStateProperty(initialState, stateProperty);
    },
    componentDidMount: function componentDidMount() {
      var componentInstance = this;
      subscribe(this, store, keys, componentInstance, stateProperty, this.constructor.displayName);
    },
    componentWillUnmount: function componentWillUnmount() {
      unSubscribe(this);
    }
  };
}

function updateConnects(_this, store, keys, stateProperty) {
  if (_this[_constants.unsubscribers]) {
    unSubscribe(_this);
  }

  var currentState = getInitialStateFunc(store, keys, _this.constructor.displayName);
  setStateFunc(_this, currentState, stateProperty);

  subscribe(_this, store, keys, _this, stateProperty, _this.constructor.displayName);
  return function updateConnectsUnSubscribe() {
    unSubscribe(_this);
  };
}

/**
 *
 * @param React - react-native or react
 * @param {object} store - Cartiv store to be connected to its state
 * @param {{k:v}|string|[{k:v}|string]} keys - connect to a specific key in the state
 *  pass string - key in the store, rename it with object - {storeKey: newName}, or send a list of those
 * @param {string} stateProperty - set the store's state
 * @returns {Function} - decorator function that receives a component to control its state;
 */
function connectDecorator(React, store, keys, stateProperty) {
  return function componentDecorator(Component) {
    //if no explicit state declaration in 'constructor'
    Component.prototype.state = {};

    return function (_React$Component) {
      (0, _inherits3.default)(ConnectorWrapper, _React$Component);

      function ConnectorWrapper() {
        (0, _classCallCheck3.default)(this, ConnectorWrapper);
        return (0, _possibleConstructorReturn3.default)(this, (ConnectorWrapper.__proto__ || (0, _getPrototypeOf2.default)(ConnectorWrapper)).apply(this, arguments));
      }

      (0, _createClass3.default)(ConnectorWrapper, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var findInnerComponent = function findInnerComponent(instance) {
            //recursively find inner most 'real react component', allowing multiple decorators
            if (instance.refs[_constants.componentRef]) {
              return findInnerComponent(instance.refs[_constants.componentRef]);
            }
            return instance;
          };

          var componentInstance = findInnerComponent(this.refs[_constants.componentRef]);

          var initialState = getInitialStateFunc(store, keys, Component.name);
          setStateFunc(componentInstance, initialState, stateProperty);

          subscribe(this, store, keys, componentInstance, stateProperty, componentInstance.constructor.name);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          unSubscribe(this);
        }
      }, {
        key: 'render',
        value: function render() {
          return React.createElement(Component, (0, _extends3.default)({ ref: _constants.componentRef
          }, this.props));
        }
      }]);
      return ConnectorWrapper;
    }(React.Component);
  };
}

//import React from 'react';
//import ReactNative from 'react-native';
function createConnectDecorator(React) {
  return connectDecorator.bind(null, React);
}
//export let connectDecoratorReact = connectDecorator.bind(null, React);
//export let connectDecoratorReactNatice = connectDecorator.bind(null, ReactNative);