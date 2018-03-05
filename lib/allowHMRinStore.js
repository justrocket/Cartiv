"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

exports.default = allowHMR;

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function allowHMR(_module, store) {
  if (_module.hot) {
    _module.hot.accept();

    if (_module.hot.data) {
      var prevStore = _module.hot.data.prevStore;
      store.setState(prevStore.state);
      if (prevStore) prevStore.storeDidUpdate = null;

      store.unsubscribe = store.listen(function (state) {
        window[_constants.oldestStores][_module.id].setState(state);
      });
    }

    var getDefaultStore = function getDefaultStore() {
      if (!_module.exports) return null;
      var defaultStore = _module.exports.default;

      if (!defaultStore) {
        var defaultStoreName = (0, _keys2.default)(_module.exports).filter(function (name) {
          return name.endsWith("Store");
        })[0];
        defaultStore = _module.exports[defaultStoreName];
      }
      return defaultStore;
    };

    _module.hot.dispose(function (data) {
      var defStore = getDefaultStore();
      if (!defStore) return;

      data.prevStore = defStore;
      window[_constants.oldestStores] = window[_constants.oldestStores] || {};
      if (window[_constants.oldestStores][_module.id]) {
        data.prevStore.unsubscribe();
      } else {
        window[_constants.oldestStores][_module.id] = data.prevStore;
      }
    });
  }
}