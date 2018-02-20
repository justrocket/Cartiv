'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _refluxCore = require('reflux-core');

var _refluxCore2 = _interopRequireDefault(_refluxCore);

var _utils = require('./utils.js');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attachAction(actionName) {
  this[_constants.stateTriggers] = this[_constants.stateTriggers] || {};
  if (this[_constants.stateTriggers][actionName]) {
    console.warn( //eslint-disable-line no-console
    'Not attaching event ' + actionName + '; key already exists');
    return;
  }
  this[_constants.stateTriggers][actionName] = _refluxCore2.default.createAction();
} //var Reflux = require('reflux');
//var utils = require('./utils.js');
exports.default = {
  setState: function setState(newState) {
    if ((0, _utils.isFunction)(this.shouldStoreUpdate) && !this.shouldStoreUpdate(newState)) {
      return;
    }

    var changed = false;
    var prevState = (0, _utils.extend)({}, this.state);

    for (var key in newState) {
      if (newState.hasOwnProperty(key)) {
        if (this.state[key] !== newState[key]) {
          this.state = (0, _utils.setProp)(this.state, newState, key);

          var triggerer = this[_constants.stateTriggers][key];
          if (!triggerer) {
            attachAction.call(this, key);
          }
          triggerer.trigger(newState[key]);
          changed = true;
        }
      }
    }

    if (changed) {
      if ((0, _utils.isFunction)(this.storeDidUpdate)) {
        this.storeDidUpdate(prevState);
      }

      this.trigger(this.state);
    }
  },
  init: function init() {
    if ((0, _utils.isFunction)(this.getInitialState)) {
      this.state = this.getInitialState();
      for (var key in this.state) {
        if (this.state.hasOwnProperty(key)) {
          attachAction.call(this, key);
        }
      }
    }
  }
};