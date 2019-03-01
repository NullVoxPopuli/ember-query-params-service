import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";
import { default as QueryParamsService } from "../services/query-params";

export interface ITransformOptions {
  transform: string
}

const SERVICE_KEY = Symbol('__QUERY_PARAMS_SERVICE__');

export function queryParam<T>(name: string, options?: ITransformOptions) {
  let propertyPath = `current.${name}`;

  if (options) {
    console.warn('queryParam options are not yet implemented');
  }

  // setup the service-key ahead of instantiation so that the
  // class doesn't get depotimized when we ensure the service's
  // existence at runtime in the get/set methods
  //
  // kinda related: https://gist.github.com/twokul/9501770
  // but this tweet thread: https://twitter.com/pzuraq/status/1101251703171538944
  // this[SERVICE_KEY] = null;

  return (desc: IMethodDecorator): ElementDescriptor => {
    const result: ElementDescriptor = {
      ...desc,
      kind: 'method',
      descriptor: {
        enumerable: false,
        configurable: false,
      },
    };

    result.descriptor.get = function (): T {
      let service = ensureService(this);

      return get<any, any>(service, propertyPath);
    };
    result.descriptor.set = function (value: any) {
      let service = ensureService(this);

      set<any, any>(service, propertyPath, value);
    };

    return result;
  }
}

function ensureService(context: any): QueryParamsService {
  if (context[SERVICE_KEY]) {
    return context[SERVICE_KEY];
  }

  context[SERVICE_KEY] = getService(context);

  return context[SERVICE_KEY];
}

function getService(context: any) {
  return getOwner(context).lookup('service:queryParams');
}
