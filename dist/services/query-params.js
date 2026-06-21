import { tracked } from '@glimmer/tracking';
import Service, { inject } from '@ember/service';
import { isPresent } from '@ember/utils';
import { macroCondition, dependencySatisfies, importSync } from '@embroider/macros';
import * as qs from 'qs';

function _initializerDefineProperty(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

var _class, _descriptor, _descriptor2, _descriptor3;
let QueryParamsService = (_class = class QueryParamsService extends Service {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "router", _descriptor, this);
    _initializerDefineProperty(this, "current", _descriptor2, this);
    _initializerDefineProperty(this, "byPath", _descriptor3, this);
    this.setupProxies();
    this.updateParams();

    // TODO: drop support for Ember < 3.24 and use @ember/destroyable
    //       to not cause a memory leak in tests
    let handler = () => {
      this.updateParams();
      if (this.router.currentRouteName) {
        this.updateURL(this.router.currentRouteName);
      }
    };
    this.router.on('routeDidChange', handler);
    if (macroCondition(dependencySatisfies('ember-source', '>= 3.24.0'))) {
      const {
        registerDestructor
      } = importSync('@ember/destroyable');
      registerDestructor(this, () => {
        this.router.off('routeDidChange', handler);
      });
    }
  }
  get pathParts() {
    const [path, params] = (this.router.currentURL || '').split('?');
    const absolutePath = `${path}`.startsWith('/') ? `${path}` : `/${path}`;
    return [absolutePath, params];
  }
  setupProxies() {
    let [path] = this.pathParts;
    this.byPath[path] = this.byPath[path] || {};
    this.current = new Proxy(this.byPath[path], queryParamHandler);
  }
  updateParams() {
    this.setupProxies();
    const [path, params] = this.pathParts;
    const queryParams = params ? qs.parse(params) : {};
    this.setOnPath(path, queryParams);
  }

  /**
   * When we have stored query params for a route
   * throw them on the URL
   *
   */
  updateURL(routeName) {
    const path = this.router.urlFor(routeName);
    const {
      protocol,
      host,
      pathname,
      search,
      hash
    } = window.location;
    const queryParams = this.byPath[path];
    const qps = search.split('?')[1];
    const existing = qs.parse(qps || '');
    const query = qs.stringify(sortKeys({
      ...existing,
      ...queryParams
    }));
    const newUrl = `${protocol}//${host}${pathname}${hash}${isPresent(query) ? '?' : ''}${query}`;
    window.history.replaceState({
      path: newUrl
    }, '', newUrl);
  }
  setOnPath(path, queryParams) {
    this.byPath[path] = this.byPath[path] || {};
    Object.keys(queryParams || {}).forEach(key => {
      let value = queryParams[key];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let currentValue = this.byPath[path][key];
      if (currentValue === value) {
        return;
      }
      if (value === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delete this.byPath[path][key];
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.byPath[path][key] = value;
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "router", [inject], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, "current", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, "byPath", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return {};
  }
})), _class);
function sortKeys(unordered) {
  return Object.keys(unordered).sort().reduce((obj, key) => {
    obj[key] = unordered[key];
    return obj;
  }, {});
}
const queryParamHandler = {
  get(obj, key, ...rest) {
    return Reflect.get(obj, key, ...rest);
  },
  set(obj, key, value, ...rest) {
    let {
      protocol,
      host,
      pathname
    } = window.location;
    let query = qs.stringify(sortKeys({
      ...obj,
      [key]: value
    }));
    let newUrl = `${protocol}//${host}${pathname}${isPresent(query) ? '?' : ''}${query}`;
    window.history.pushState({
      path: newUrl
    }, '', newUrl);
    return Reflect.set(obj, key, value, ...rest);
  }
};

// DO NOT DELETE: this is how TypeScript knows how to look up your services.

export { QueryParamsService as default };
//# sourceMappingURL=query-params.js.map
