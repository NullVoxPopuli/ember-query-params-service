function isClassDescriptor(possibleDesc: [any]) {
  let [target] = possibleDesc;

  return (
    possibleDesc.length === 1 &&
    typeof target === 'function' &&
    'prototype' in target &&
    !target.__isComputedDecorator
  );
}

export function isFieldDescriptor(possibleDesc: [any, any, any]) {
  let [target, key, desc] = possibleDesc;

  return (
    possibleDesc.length === 3 &&
    typeof target === 'object' &&
    target !== null &&
    typeof key === 'string' &&
    ((typeof desc === 'object' &&
      desc !== null &&
      'enumerable' in desc &&
      'configurable' in desc) ||
      desc === undefined) // TS compatibility
  );
}

export function isDescriptor(possibleDesc: any) {
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
export function decoratorWithParams(fn: (...args: any[]) => void) {
  return function (...params: unknown[]) {
    // determine if user called as @computed('blah', 'blah') or @computed
    if (isDescriptor(params)) {
      return fn(...params);
    } else {
      return (...desc: unknown[]) => fn(...desc, params);
    }
  };
}
