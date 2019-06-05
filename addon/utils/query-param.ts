import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";
import { tracked } from '@glimmer/tracking';
import { default as QueryParamsService } from "../../app/services/query-params";

export interface ITransformOptions<T> {
  deserialize?: (queryParam: string) => T;
  serialize?: (queryParam: T) => string;
}

export function queryParam<T>(...args) {
  const [maybePathMaybeOptions, maybeOptions] = args;

  return <T = boolean, Target = Record<string, any>>(
    target: Target,
    propertyKey: keyof Target,
    sourceDescriptor?: any
  ): void => {
    const {
      set: oldSet,
      descriptor
    } = tracked(target, propertyKey, { ...sourceDescriptor,
      initializer() {
        // In order for links to work, queryParams MUST
        // exist on the controller.
        //
        // Much sadness
        const controller = getController(this, 'application');

        if (controller.queryParams) {
          controller.queryParams.push(propertyKey);
        } else {
          controller.queryParams = [propertyKey];
        }

        console.log('controller', controller);
      }
    });

    let propertyPath: string;
    let options: ITransformOptions<T>;

    if (typeof maybePathMaybeOptions === 'string') {
      propertyPath = `current.${ maybePathMaybeOptions }`;
      options = maybeOptions || {};
    } else {
      propertyPath = `current.${propertyKey}`;
      options = maybePathMaybeOptions || {};
    }

    const result = {
      ...(descriptor || {}),
      initializer: undefined,
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
