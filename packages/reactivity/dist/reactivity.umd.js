(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@MyVue/shared')) :
  typeof define === 'function' && define.amd ? define(['exports', '@MyVue/shared'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueReactivity = {}, global.shared));
})(this, (function (exports, shared) { 'use strict';

  const reactive = () => {
    return shared.add(1, 2);
  };

  exports.reactive = reactive;

}));
