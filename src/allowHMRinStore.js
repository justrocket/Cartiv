import { oldestStores } from './constants';

export default function allowHMR(_module, store) {
  if (_module.hot) {
    _module.hot.accept();

    if (_module.hot.data) {
      let prevStore = _module.hot.data.prevStore;
      store.setState(prevStore.state);
      if (prevStore) prevStore.storeDidUpdate = null;

      store.unsubscribe = store.listen((state) => {
        window[oldestStores][_module.id].setState(state);
      });
    }

    const getDefaultStore = function () {
      if (!_module.exports) return null;
      var defaultStore = _module.exports.default;

      if (!defaultStore) {
        var defaultStoreName = Object.keys(_module.exports)
          .filter(name => name.endsWith("Store"))[0]
        defaultStore = _module.exports[defaultStoreName];
      }
      return defaultStore;
    };


    _module.hot.dispose((data) => {
      const defStore = getDefaultStore();
      if (!defStore) return;

      data.prevStore = defStore;
      window[oldestStores] = window[oldestStores] || {};
      if (window[oldestStores][_module.id]) {
        data.prevStore.unsubscribe();
      } else {
        window[oldestStores][_module.id] = data.prevStore;
      }
    });
  }
}
