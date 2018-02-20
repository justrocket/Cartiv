'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = createActions;

var _refluxCore = require('reflux-core');

var _refluxCore2 = _interopRequireDefault(_refluxCore);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createActions(actionNames, options) {
  options = options || {};
  if ((0, _utils.isString)(actionNames)) {
    if (actionNames === '') {
      throw new Error('Please mention action names');
    }
    actionNames = [actionNames];
  } else if (!(0, _utils.isArrayOfStrings)(actionNames)) {
    throw new Error('Please mention action names as array of strings or single action as a string');
  }

  var actions = {};
  actionNames.forEach(function (name) {
    actions[name] = _refluxCore2.default.createAction((0, _extends3.default)({}, options, { actionName: name }));
  });
  return actions;
}