'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateConnects = exports.createConnector = exports.connect = exports.createStore = exports.createActions = exports.createAPI = undefined;

var _createStore = require('./createStore');

var _createStore2 = _interopRequireDefault(_createStore);

var _createAPIsHolder = require('./createAPIsHolder');

var _createAPIsHolder2 = _interopRequireDefault(_createAPIsHolder);

var _createActions = require('./createActions');

var _createActions2 = _interopRequireDefault(_createActions);

var _componentConnectors = require('./componentConnectors');

var _allowHMRinStore = require('./allowHMRinStore');

var _allowHMRinStore2 = _interopRequireDefault(_allowHMRinStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_createStore2.default.allowHMR = _allowHMRinStore2.default;

exports.createAPI = _createAPIsHolder2.default;
exports.createActions = _createActions2.default;
exports.createStore = _createStore2.default;
exports.connect = _componentConnectors.connectMixin;
exports.createConnector = _componentConnectors.createConnectDecorator;
exports.updateConnects = _componentConnectors.updateConnects;

//connectDecoratorReactNatice as connectorNative