import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";
import { tracked } from '@glimmer/tracking';
import { default as QueryParamsService } from "../../app/services/query-params";

export interface ITransformOptions<T> {
  fromString?: (queryParam: string) => T;
  toString?: (queryParam: T) => string;
}

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
    const {
      get: oldGet,
      set: oldSet,
      descriptor
    } = tracked(target, propertyKey, sourceDescriptor);

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

        const serialized = trySerialize(value, options);
        set<any, any>(service, propertyPath, serialized);
        oldSet!.call(this, serialized);
      },
    };

    return result as any;
  };
}

function tryDeserialize<T>(value: any, options?: ITransformOptions<T>) {
  if (!options) return value;
  if (!options.fromString) return value;

  return options.fromString(value);
}

function trySerialize<T>(value: any, options?: ITransformOptions<T>) {
  if (!options) return value;
  if (!options.toString) return value;

  return options.toString(value);
}

// could there ever be a problem with using only one variable in module-space?
let qpService: QueryParamsService;
function ensureService(context: any): QueryParamsService {
  if (qpService) { return qpService; }

  qpService = getQPService(context);

  return qpService;
}

function getQPService(context: any) {
  return getOwner(context).lookup("service:queryParams");
}

function getController(context: any, name: string) {
return getOwner(context).lookup(`controller:${name}`);
}
