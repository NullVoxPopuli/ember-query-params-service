import { get, set } from '@ember/object';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';
import { Args, extractArgs, ensureService, tryDeserialize, trySerialize } from './helpers';

// type DecoratorCreator = (...args: Args<string>) => PropertyDecorator;
// type DecoratorWithParams = PropertyDecorator | DecoratorCreator;

export const queryParam =( decoratorWithParams(queryParamWithOptionalParams) as unknown) as any /* ugh */;

function queryParamWithOptionalParams<T = boolean>(
  _target: any,
  propertyKey: string,
  sourceDescriptor?: any,
  ...args: Args<T>
): void {
  const { get: oldGet, initializer } = sourceDescriptor;
  const [propertyPath, options] = extractArgs<T>(args, propertyKey);

  // There is no initializer, so stage 1 decorators actually
  // don't have the capability to do what I want :(
  // setupController(target);
  //
  // this means that in order to use any query param willy-nilly
  // we'll need to prevent the router from looking up the controller
  // to remove un-specified query params

  const result = {
    configurable: true,
    enumerable: true,
    get: function (): T | undefined {
      // setupController(this, 'application');
      const service = ensureService(this);
      const value = get<any, any>(service, propertyPath);
      const deserialized = tryDeserialize(value, options);

      return deserialized || oldGet?.() || initializer?.();
    },
    set: function (value?: T ) {
      // setupController(this, 'application');
      const service = ensureService(this);
      const serialized = trySerialize(value, options);

      set<any, any>(service, propertyPath, serialized);
    },
  };

  return result as any;
}
