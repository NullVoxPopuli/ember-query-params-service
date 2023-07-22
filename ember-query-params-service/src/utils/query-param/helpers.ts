import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

import type { default as QueryParamsService } from '../../services/query-params';

export interface ITransformOptions<T> {
  defaultValue?: string;
  deserialize?: (queryParam: string) => T;
  serialize?: (queryParam: T) => string;
}

export type Args<T> = [] | [string, ITransformOptions<T>] | [ITransformOptions<T>] | [string];

export function extractArgs<T>(args: Args<T>, propertyKey: string): [string, ITransformOptions<T>] {
  const [maybePathMaybeOptions, maybeOptions] = args;

  let propertyPath: string;
  let options: ITransformOptions<T>;

  if (typeof maybePathMaybeOptions === 'string') {
    propertyPath = `current.${maybePathMaybeOptions}`;
    options = maybeOptions || {};
  } else {
    propertyPath = `current.${propertyKey}`;
    options = maybePathMaybeOptions || {};
  }

  return [propertyPath, options];
}

export function tryDeserialize<T>(value: any, options: ITransformOptions<T>) {
  value = value ?? options.defaultValue;

  if (!options.deserialize) return value;

  return options.deserialize(value);
}

export function trySerialize<T>(value: any, options: ITransformOptions<T>) {
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

export function ensureService(context: any): QueryParamsService {
  let service = serviceCache.get(context);

  if (!service) {
    service = getQPService(context);

    serviceCache.set(context, service);
  }

  return service;
}

export function getQPService(context: any): QueryParamsService {
  let owner = getOwner(context);

  assert(`context does not have an owner, and an owner is required for accessing services`, owner);

  return owner.lookup('service:query-params') as unknown as QueryParamsService;
}
