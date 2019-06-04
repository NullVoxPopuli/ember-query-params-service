import Service, { inject as service } from "@ember/service";
import RouterService from "@ember/routing/router-service";

import { tracked } from "@glimmer/tracking";
import * as qs from "qs";

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

  init(...args: any[]) {
    super.init(...args);

    this.updateParams();

    // this.router.on("routeDidChange", () => this.updateParams());
    // this.router.on("routeWillChange", () => this.updateParams());
  }

  get pathParts() {
    const [path, params] = (this.router.currentURL || "").split("?");

    return [path, params];
  }

  private setupProxies() {
    let [path, _params] = this.pathParts;

    this.byPath[path] = this.byPath[path] || {};

    this.current = new Proxy(this.byPath[path], queryParamHandler);
  }

  private updateParams() {
    this.setupProxies();

    const [path, params] = this.pathParts;
    const queryParams = params && qs.parse(params);

    Object.keys(queryParams || {}).forEach(key => {
      let value = queryParams[key];
      let currentValue = this.byPath[path][key];

      if (currentValue === value) {
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

    window.history.pushState({ path: newUrl }, "", newUrl);

    return Reflect.set(obj, key, value, ...rest);
  }
};

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module "@ember/service" {
  interface Registry {
    "query-params": QueryParams;
  }
}
