import Service, { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

import { tracked } from '@glimmer/tracking';
import * as qs from 'qs';

interface QueryParams {
  [key: string]: number | string | undefined | QueryParams;
}

interface QueryParamsByPath { [key: string]: QueryParams; }

const queryParamHandler = {
  get(obj: any, key: string, ...rest: any[]) {
    return Reflect.get(obj, key, ...rest);
  },
  set(obj: any, key: string, value: any, ...rest: any[]) {
    let { protocol, host, pathname } = window.location;
    let query = qs.stringify({ ...obj, [key]: value });
    let newUrl = `${protocol}//${host}${pathname}?${query}`;

    window.history.pushState({ path: newUrl }, '', newUrl);

    return Reflect.set(obj, key, value, ...rest);
  }
}

export default class QueryParamsService extends Service {
  @service router!: RouterService;

  _current: QueryParams = {};
  @tracked current!: QueryParams;
  @tracked byPath: QueryParamsByPath = {};

  constructor() {
    super(...arguments);

    this.setupProxies();
  }

  init() {
    this.updateParams();

    this.router.on('routeDidChange', (_transition: TransitionEvent) => {
      this.updateParams();
    });
  }

  private setupProxies() {
    this.current = new Proxy(this._current, queryParamHandler);
  }

  private updateParams() {
    const [path, params] = (this.router.currentURL || '').split('?');
    const queryParams = params && qs.parse(params);

    // debugger;
    Object.keys(queryParams || {}).forEach(key => {
      let value = queryParams[key];
      let currentValue = this.current[key];

      if (currentValue === value) {
        return;
      }

      this.current[key] = value;
    });


    this.byPath[path] = this.current;
  }
}


// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'query-params': QueryParams;
  }
}
