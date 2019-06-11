import Service, { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

import { tracked } from '@glimmer/tracking';
import * as qs from 'qs';
import Transition from '@ember/routing/-private/transition';

interface QueryParams {
  [key: string]: number | string | undefined | QueryParams;
}

interface QueryParamsByPath {
  [key: string]: QueryParams;
}

export default class QueryParamsService extends Service {
  @service router!: RouterService;

  @tracked current!: QueryParams;
  @tracked byPath: QueryParamsByPath = {};

  constructor(...args: any[]) {
    super(...args);

    this.setupProxies();
  }

  init() {
    super.init();

    this.updateParams();

    this.router.on('routeDidChange', () => this.updateParams());
    this.router.on('routeWillChange', transition => this.updateURL(transition));
  }

  get pathParts() {
    const [path, params] = (this.router.currentURL || '').split('?');
    const absolutePath = path.startsWith('/') ? path : `/${path}`;

    return [absolutePath, params];
  }

  private setupProxies() {
    let [path] = this.pathParts;

    this.byPath[path] = this.byPath[path] || {};

    this.current = new Proxy(this.byPath[path], queryParamHandler);
  }

  private updateParams() {
    console.log('didChange...');
    this.setupProxies();

    const [path, params] = this.pathParts;
    const queryParams = params && qs.parse(params);

    this.setOnPath(path, queryParams);
  }

  /**
   * When we have stored query params for a route
   * throw them on the URL
   *
   */
  private updateURL(transition: Transition) {
    console.log('willChange');
    const path = this.router.urlFor(transition.to.name);
    const { protocol, host, pathname, search, hash } = window.location;
    const queryParams = this.byPath[path];
    const existing = qs.parse(search.split('?')[1]);
    const query = qs.stringify({ ...existing, ...queryParams });
    const newUrl = `${protocol}//${host}${pathname}${hash}?${query}`;

    window.history.replaceState({ path: newUrl }, '', newUrl);
  }

  private setOnPath(path: string, queryParams: object) {
    this.byPath[path] = this.byPath[path] || {};

    Object.keys(queryParams || {}).forEach(key => {
      let value = queryParams[key];
      let currentValue = this.byPath[path][key];

      if (currentValue === value) {
        return;
      }

      if (value === undefined) {
        delete this.byPath[path][key];
        return;
      }

      this.byPath[path][key] = value;
    });
  }
}

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
  },
};

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'query-params': QueryParams;
  }
}
