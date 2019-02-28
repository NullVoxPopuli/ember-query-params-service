import { get, set } from "@ember/object";
import { getOwner } from "@ember/application";

export interface ITransformOptions {
  transform: string
}

export function queryParam<T>(name: string, options?: ITransformOptions) {
  let propertyPath = `current.${name}`;

  if (options) {
    console.warn('queryParam options are not yet implemented');
  }

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
      let service = getService(this);

      return get(service, propertyPath);
    };
    result.descriptor.set = function (value: any) {
      let service = getService(this);

      set(service, propertyPath, value);
    };

    return result;
  }
}

function getService(context: any) {
  return getOwner(context).lookup('service:queryParams');
}
