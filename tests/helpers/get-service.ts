import { getContext } from '@ember/test-helpers';

export function getService<T>(name: string): T {
  const { owner } = getContext() as any;

  const service = owner.lookup(`service:${name}`);

  return service;
}
