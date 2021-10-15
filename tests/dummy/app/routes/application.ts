import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type { QueryParamsService } from 'ember-query-params-service';

export default class ApplicationRoute extends Route {
  @service('query-params') qp!: QueryParamsService;

  model() {
    return {
      QPs: JSON.stringify(this.qp.current),
    };
  }
}
