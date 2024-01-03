'use strict';

var reactivity = require('@MyVue/reactivity');
var shared = require('@MyVue/shared');

const transform = () => {
  const result1 = reactivity.reactive();
  const result2 = shared.reduce(2, 1);
  return result1 + result2;
};

exports.transform = transform;
