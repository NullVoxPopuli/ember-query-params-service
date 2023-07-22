import { tracked } from '@glimmer/tracking';
import Service, { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { dependencySatisfies, importSync, macroCondition } from '@embroider/macros';

import * as qs from 'qs';

import type RouterService from '@ember/routing/router-service';

interface QueryParams {
  [key: string]: number | string | QueryParams | qs.ParsedQs[keyof qs.ParsedQs];
}

interface QueryParamsByPath {
  [key: string]: QueryParams;
}

export default class QueryParamsService extends Service {
  @service declare router: RouterService;

  @tracked declare current: QueryParams;
  @tracked byPath: QueryParamsByPath = {};

  constructor(...args: any[]) {
    super(...args);

    this.setupProxies();
    this.updateParams();

    // TODO: drop support for Ember < 3.24 and use @ember/destroyable
    //       to not cause a memory leak in tests
    let handler = () => {
      this.updateParams();

      if (this.router.currentRouteName) {
        this.updateURL(this.router.currentRouteName);
      }
    };

    this.router.on('routeDidChange', handler);

    if (macroCondition(dependencySatisfies('ember-source', '>= 3.24.0'))) {
      const { registerDestructor } = importSync('@ember/destroyable') as any;

      registerDestructor(this, () => {
        this.router.off('routeDidChange', handler);
      });
    }
  }

  get pathParts(): [string, string | undefined] {
    const [path, params] = (this.router.currentURL || '').split('?');
    const absolutePath = `${path}`.startsWith('/') ? `${path}` : `/${path}`;

    return [absolutePath, params];
  }

  private setupProxies() {
    let [path] = this.pathParts;

    this.byPath[path] = this.byPath[path] || {};

    this.current = new Proxy(this.byPath[path], queryParamHandler);
  }

  private updateParams() {
    this.setupProxies();

    const [path, params] = this.pathParts;
    const queryParams = params ? qs.parse(params) : {};

    this.setOnPath(path, queryParams);
  }

  /**
   * When we have stored query params for a route
   * throw them on the URL
   *
   */
  private updateURL(routeName: string) {
    const path = this.router.urlFor(routeName);
    const { protocol, host, pathname, search, hash } = window.location;
    const queryParams = this.byPath[path];
    const qps = search.split('?')[1];
    const existing = qs.parse(qps || '');
    const query = qs.stringify(sortKeys({ ...existing, ...queryParams }));
    const newUrl = `${protocol}//${host}${pathname}${hash}${isPresent(query) ? '?' : ''}${query}`;

    window.history.replaceState({ path: newUrl }, '', newUrl);
  }

  private setOnPath(path: string, queryParams: qs.ParsedQs) {
    this.byPath[path] = this.byPath[path] || {};

    Object.keys(queryParams || {}).forEach((key) => {
      let value = queryParams[key];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      let currentValue = this.byPath[path]![key];

      if (currentValue === value) {
        return;
      }

      if (value === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        delete this.byPath[path]![key];

        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.byPath[path]![key] = value;
    });
  }
}

function sortKeys(unordered: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(unordered)
    .sort()
    .reduce((obj, key) => {
      obj[key] = unordered[key];

      return obj;
    }, {} as Record<string, unknown>);
}

const queryParamHandler = {
  get(obj: any, key: string, ...rest: any[]) {
    return Reflect.get(obj, key, ...rest);
  },
  set(obj: any, key: string, value: any, ...rest: any[]) {
    let { protocol, host, pathname } = window.location;
    let query = qs.stringify(sortKeys({ ...obj, [key]: value }));
    let newUrl = `${protocol}//${host}${pathname}${isPresent(query) ? '?' : ''}${query}`;

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
