'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAPIsHolder;

var _utils = require('./utils');

function createAPIsHolder() {
  function APIsHolder() {}

  function addAPIActions(apiName, actions) {
    if (typeof apiName !== 'string' || !apiName) {
      throw new Error('Please mention api name');
    }
    if (this[apiName]) {
      (0, _utils.extend)(this[apiName], actions);
    } else {
      this[apiName] = actions;
    }
  }

  APIsHolder.prototype.addAPIActions = addAPIActions;

  return new APIsHolder();
}