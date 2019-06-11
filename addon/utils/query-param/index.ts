import { get, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { decoratorWithParams } from '@ember-decorators/utils/decorator';
import { Args, extractArgs, ensureService, tryDeserialize, trySerialize } from './helpers';

export const queryParam = decoratorWithParams(queryParamWithOptionalParams);

function queryParamWithOptionalParams<T = boolean>(
  target: any,
  propertyKey: string,
  sourceDescriptor?: any,
  ...args: Args<T>
): void {
  const trackedDescriptor = tracked(target, propertyKey, sourceDescriptor);
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

      return deserialized || trackedDescriptor.get!();
    },
    set: function (value?: T ) {
      // setupController(this, 'application');
      const service = ensureService(this);
      const serialized = trySerialize(value, options);

      set<any, any>(service, propertyPath, serialized);
      trackedDescriptor.set!.call(this, serialized);
    },
  };

  return result as any;
}
