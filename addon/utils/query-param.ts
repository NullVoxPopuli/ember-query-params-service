import { get, set } from '@ember/object';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';
import { default as QueryParamsService } from '../services/query-params';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';

export interface ITransformOptions<T> {
  deserialize?: (queryParam: string) => T;
  serialize?: (queryParam: T) => string;
}

type Args<T> = [] | [string, ITransformOptions<T>] | [ITransformOptions<T>] | [string];

//function setupController(context: any, propertyKey: string) {
//  // In order for links to work, queryParams MUST
//  // exist on the controller.
//  //
//  // Much sadness
//  const controller = getController(context, 'application');

//  const p = controller.constructor.prototype;

//  if (p.queryParams) {
//    if (!p.queryParams.includes(propertyKey)) {
//      p.queryParams.push(propertyKey);
//    }
//  }

//  p.queryParams = [propertyKey];
//}

function extractArgs<T>(args: Args<T>, propertyKey: string): [string, ITransformOptions<T>] {
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

function tryDeserialize<T>(value: any, options: ITransformOptions<T>) {
  if (!options.deserialize) return value;

  return options.deserialize(value);
}

function trySerialize<T>(value: any, options: ITransformOptions<T>) {
  if (!options.serialize) return value;

  return options.serialize(value);
}

// could there ever be a problem with using only one variable in module-space?
let qpService: QueryParamsService;
function ensureService(context: any): QueryParamsService {
  if (qpService) {
    return qpService;
  }

  qpService = getQPService(context);

  return qpService;
}

function getQPService(context: any) {
  return getOwner(context).lookup('service:queryParams');
}

// function getController(context: any, name: string) {
//   return getOwner(context).lookup(`controller:${name}`);
// }
//
export const queryParam = decoratorWithParams(queryParamWithOptionalParams);

function queryParamWithOptionalParams<T = boolean>(
  target: any,
  propertyKey: string,
  sourceDescriptor?: any,
  ...args: Args<T>
): void {
  const { set: oldSet } = tracked(target, propertyKey, sourceDescriptor);
  const [propertyPath, options] = extractArgs<T>(args, propertyKey);

  // There is no initializer, so stage 1 decorators actually
  // don't have the capability to do what I want :(
  // setupController(target);

  const result = {
    configurable: true,
    enumerable: true,
    get: function(): T {
      // setupController(this, 'application');
      const service = ensureService(this);
      const value = get<any, any>(service, propertyPath);
      const deserialized = tryDeserialize(value, options);

      return deserialized;
    },
    set: function(value: any) {
      // setupController(this, 'application');
      const service = ensureService(this);
      const serialized = trySerialize(value, options);

      set<any, any>(service, propertyPath, serialized);
      oldSet!.call(this, serialized);
    },
  };

  return result as any;
}
