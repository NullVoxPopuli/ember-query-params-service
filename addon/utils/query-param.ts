import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";
import { tracked } from '@glimmer/tracking';
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
    sourceDescriptor?: any
  ): void => {
    const { get: oldGet, set: oldSet, descriptor  } = tracked(target, propertyKey, sourceDescriptor);

    const result = {
      ...(descriptor || {}),
      get: function(): T {
        const service = ensureService(this);
        const value = get<any, any>(service, propertyPath);
        const deserialized = tryDeserialize(value, options);

        return deserialized;
      },
      set: function(value: any) {
        const service = ensureService(this);

        set<any, any>(service, propertyPath, value);
        oldSet!.call(this, value);
      },
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
