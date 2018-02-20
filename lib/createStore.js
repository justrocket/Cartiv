'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = create;

var _refluxCore = require('reflux-core');

var _refluxCore2 = _interopRequireDefault(_refluxCore);

var _createActions = require('./createActions');

var _createActions2 = _interopRequireDefault(_createActions);

var _storeMixin = require('./storeMixin');

var _storeMixin2 = _interopRequireDefault(_storeMixin);

var _utils = require('./utils');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***
 *
 * @param {object} dispatcherConfig
 * @param {APIsHolder} dispatcherConfig.api - relevant APIs holder
 *
 * @param {string} dispatcherConfig.name - this store API, to be called with API.storeName.onChangeSomething
 *
 * @param {function|[string]} [dispatcherConfig.actions = startWithOn] - list of action names,
 * or a function to filter store's methods to select which will
 * become part of the API (defaulted to get methods starts with "on"+Capital like: `onSomething`)
 *
 * @param {function|[string]} [dispatcherConfig.syncActions = startWithOnEndWithSync] - list of action names,
 * or a function to filter store's methods to select which will
 * become part of the API. These actions are invoked SYNCHRONOUSLY
 * (defaulted to get methods with format "on"+Capital+"Sync" like: `onSomethingSync`)
 *
 * @param {object} storeDefinition - object containing store methods
 * @param {function} storeDefinition.getInitialState - function that returns the initial state
 * @returns {object}
 */
function create(dispatcherConfig, storeDefinition) {
  var api = dispatcherConfig.api,
      name = dispatcherConfig.name,
      actions = dispatcherConfig.actions,
      syncActions = dispatcherConfig.syncActions;


  if (!(0, _utils.isObject)(api) || !(0, _utils.isFunction)(api.addAPIActions) /*|| !(api instanceof 'APIsHolder')*/) {
      throw new Error('dispatcherConfig.api should be an API object');
    }
  if (!(0, _utils.isString)(name)) {
    throw new Error('dispatcherConfig.name should be a string');
  }
  if (actions && !(0, _utils.isFunction)(actions) && !(0, _utils.isArrayOfStrings)(actions)) {
    throw new Error('dispatcherConfig.name should be a string');
  }
  if (syncActions && !(0, _utils.isFunction)(syncActions) && !(0, _utils.isArrayOfStrings)(syncActions)) {
    throw new Error('dispatcherConfig.syncActions should be a a function or array of strings');
  }
  if (!(0, _utils.isObject)(storeDefinition)) {
    throw new Error('store definition is not plain object');
  }
  if (storeDefinition.getInitialState && !(0, _utils.isFunction)(storeDefinition.getInitialState)) {
    throw new Error('getInitialState is not a function');
  }

  var SyncActionStrs = void 0;

  if ((0, _utils.isArray)(syncActions)) {
    SyncActionStrs = syncActions;
  } else {
    var filterFunc = (0, _utils.isFunction)(syncActions) ? syncActions : _utils.startWithOnEndWithSync;
    SyncActionStrs = (0, _keys2.default)(storeDefinition).filter(filterFunc);
  }

  var ActionStrs = void 0;

  if ((0, _utils.isArray)(actions)) {
    ActionStrs = actions;
  } else {
    var _filterFunc = (0, _utils.isFunction)(actions) ? actions : _utils.startWithOn;
    ActionStrs = (0, _keys2.default)(storeDefinition).filter(_filterFunc);
  }

  ActionStrs = ActionStrs.filter(function (str) {
    return !SyncActionStrs || SyncActionStrs.indexOf(str) === -1;
  });

  var SyncActions = (0, _createActions2.default)(SyncActionStrs, { sync: true });
  var AsyncActions = (0, _createActions2.default)(ActionStrs, {});

  var storeActions = (0, _assign2.default)(SyncActions, AsyncActions);

  api.addAPIActions(name, storeActions);
  //extend(api[name], storeActions);
  //api[name] = reflux.createActions(ActionStrs);

  storeDefinition.mixins = [_storeMixin2.default];
  storeDefinition.listenables = api[name];
  storeDefinition[_constants.storeName] = name;

  return _refluxCore2.default.createStore(storeDefinition);
}