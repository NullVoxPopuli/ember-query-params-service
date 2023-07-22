import { getContext } from '@ember/test-helpers';

import type { QueryParamsService } from 'ember-query-params-service';

export function getService<T>(name: string): T {
  const { owner } = getContext() as any;

  const service = owner.lookup(`service:${name}`);

  return service;
}

export function getQPService() {
  return getService<QueryParamsService>('query-params');
}
