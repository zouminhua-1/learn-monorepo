(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@MyVue/reactivity'), require('@MyVue/shared')) :
  typeof define === 'function' && define.amd ? define(['exports', '@MyVue/reactivity', '@MyVue/shared'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueCompiler = {}, global.reactivity, global.shared));
})(this, (function (exports, reactivity, shared) { 'use strict';

  const transform = () => {
    const result1 = reactivity.reactive();
    const result2 = shared.reduce(2, 1);
    return result1 + result2;
  };

  exports.transform = transform;

}));
