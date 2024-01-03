'use strict';

var shared = require('@MyVue/shared');

const reactive = () => {
  return shared.add(1, 2);
};

exports.reactive = reactive;
