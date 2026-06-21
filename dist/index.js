export { default as QueryParamsService } from './services/query-params.js';
import { get, set } from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

function isClassDescriptor(possibleDesc) {
  let [target] = possibleDesc;
  return possibleDesc.length === 1 && typeof target === 'function' && 'prototype' in target && !target.__isComputedDecorator;
}
function isFieldDescriptor(possibleDesc) {
  let [target, key, desc] = possibleDesc;
  return possibleDesc.length === 3 && typeof target === 'object' && target !== null && typeof key === 'string' && (typeof desc === 'object' && desc !== null && 'enumerable' in desc && 'configurable' in desc || desc === undefined) // TS compatibility
  ;
}

function isDescriptor(possibleDesc) {
  return isFieldDescriptor(possibleDesc) || isClassDescriptor(possibleDesc);
}

/**
 * A macro that takes a decorator function and allows it to optionally
 * receive parameters
 *
 * ```js
 * let foo = decoratorWithParams((target, desc, key, params) => {
 *   console.log(params);
 * });
 *
 * class {
 *   @foo bar; // undefined
 *   @foo('bar') baz; // ['bar']
 * }
 * ```
 *
 * @param {Function} fn - decorator function
 */
function decoratorWithParams(fn) {
  return function (...params) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params)) {
      return fn(...params);
    } else {
      return (...desc) => fn(...desc, params);
    }
  };
}

function extractArgs(args, propertyKey) {
  const [maybePathMaybeOptions, maybeOptions] = args;
  let propertyPath;
  let options;
  if (typeof maybePathMaybeOptions === 'string') {
    propertyPath = `current.${maybePathMaybeOptions}`;
    options = maybeOptions || {};
  } else {
    propertyPath = `current.${propertyKey}`;
    options = maybePathMaybeOptions || {};
  }
  return [propertyPath, options];
}
function tryDeserialize(value, options) {
  value = value ?? options.defaultValue;
  if (!options.deserialize) return value;
  return options.deserialize(value);
}
function trySerialize(value, options) {
  if (value === options.defaultValue) {
    value = undefined;
  }
  if (!options.serialize) return value;
  return options.serialize(value);
}

// can't cache the service in module space because we run in to race  conditions
// where a service on an old app instance may still exist, but be tied to the
// old application instead of the current one (such as in tests)
const serviceCache = new WeakMap();
function ensureService(context) {
  let service = serviceCache.get(context);
  if (!service) {
    service = getQPService(context);
    serviceCache.set(context, service);
  }
  return service;
}
function getQPService(context) {
  let owner = getOwner(context);
  assert(`context does not have an owner, and an owner is required for accessing services`, owner);
  return owner.lookup('service:query-params');
}

// type DecoratorCreator = (...args: Args<string>) => PropertyDecorator;
// type DecoratorWithParams = PropertyDecorator | DecoratorCreator;
const queryParam = decoratorWithParams(queryParamWithOptionalParams); /* ugh */

function queryParamWithOptionalParams(_target, propertyKey, sourceDescriptor, ...args) {
  const {
    get: oldGet,
    initializer
  } = sourceDescriptor;
  // TODO: why is args sometimes an array of arrays?
  const [propertyPath, options] = extractArgs(args.flat(), propertyKey);

  // There is no initializer, so stage 1 decorators actually
  // don't have the capability to do what I want :(
  // setupController(target);
  //
  // this means that in order to use any query param willy-nilly
  // we'll need to prevent the router from looking up the controller
  // to remove un-specified query params

  const result = {
    configurable: true,
    enumerable: true,
    get: function () {
      // setupController(this, 'application');
      const service = ensureService(this);
      const value = get(service, propertyPath);
      const deserialized = tryDeserialize(value, options);
      return deserialized ?? oldGet?.() ?? initializer?.();
    },
    set: function (value) {
      // setupController(this, 'application');
      const service = ensureService(this);
      const serialized = trySerialize(value, options);
      set(service, propertyPath, serialized);
    }
  };
  return result;
}

export { queryParam };
//# sourceMappingURL=index.js.map
