'use strict';

module.exports = {
  name: require('./package').name,

  // borrowed from
  // https://github.com/rwjblue/ember-modifier-manager-polyfill/blob/master/index.js
  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/ember-query-params-service.js');
  },

  treeForVendor(tree) {
    return tree;
  },
};
