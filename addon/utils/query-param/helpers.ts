import { getOwner } from '@ember/application';
import { default as QueryParamsService } from '../../services/query-params';

export interface ITransformOptions<T> {
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
  if (!options.deserialize) return value;

  return options.deserialize(value);
}

export function trySerialize<T>(value: any, options: ITransformOptions<T>) {
  if (!options.serialize) return value;

  return options.serialize(value);
}

// could there ever be a problem with using only one variable in module-space?
// can't cache the service in module space because we run in to race  conditions
// where a service on an old app instance may still exist, but be tied to the
// old application istead of the current one (such as in tests)
const serviceCache = new WeakMap();
export function ensureService(context: any): QueryParamsService {
  let service = serviceCache.get(context);

  if (!service) {
    service = getQPService(context);

    serviceCache.set(context, service);
  }

  return service;
}

export function getQPService(context: any) {
  return getOwner(context).lookup('service:queryParams');
}
