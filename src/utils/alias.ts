import { get, set } from "@ember/object";

export function alias<T>(propertyPath: string) {
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
      return get(this, propertyPath);
    };
    result.descriptor.set = function (value: any) {
      set(this, propertyPath, value);
    };

    return result;
  }
}
