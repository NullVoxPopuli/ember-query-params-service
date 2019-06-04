import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";
import { default as QueryParamsService } from "../../app/services/query-params";

export interface ITransformOptions<T> {
  deserialize?: (queryParam: string) => T;
}

const SERVICE_KEY = Symbol("__QUERY_PARAMS_SERVICE__");

export function queryParam<T>(name: string, options?: ITransformOptions<T>) {
  let propertyPath = `current.${name}`;

  if (options) {
    console.warn("queryParam options are not yet implemented");
  }

  return <T = boolean, Target = Record<string, any>>(
    target: Target,
    propertyKey: keyof Target,
    descriptor?: any
  ): void => {
    const result = {
      ...(descriptor || {}),
      enumerable: false,
      configurable: false
      // initializer() {
      //   // setup the service-key ahead of instantiation so that the
      //   // class doesn't get depotimized when we ensure the service's
      //   // existence at runtime in the get/set methods
      //   //
      //   // kinda related: https://gist.github.com/twokul/9501770
      //   // but this tweet thread: https://twitter.com/pzuraq/status/1101251703171538944
      //   this[SERVICE_KEY] = null;
      //   console.log('eh', this);
      // },
    };

    result.get = function(): T {
      let service = ensureService(this);
      let value = get<any, any>(service, propertyPath);

      return tryDeserialize(value, options);
    };
    result.set = function(value: any) {
      let service = ensureService(this);

      set<any, any>(service, propertyPath, value);
    };

    return result as any;
  };
}

function tryDeserialize<T>(value: any, options?: ITransformOptions<T>) {
  if (!options) return value;
  if (!options.deserialize) return value;

  return options.deserialize(value);
}

function ensureService(context: any): QueryParamsService {
  if (context[SERVICE_KEY]) {
    return context[SERVICE_KEY];
  }

  context[SERVICE_KEY] = getService(context);

  return context[SERVICE_KEY];
}

function getService(context: any) {
  return getOwner(context).lookup("service:queryParams");
}
