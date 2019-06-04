import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { QueryParamsService, queryParam } from 'ember-query-params-service';

console.log('eh?', QueryParamsService, queryParam);

export default class ApplicationRoute extends Route {
  @service queryParams!: QueryParamsService;

  model() {
    return {
      QPs: JSON.stringify(this.queryParams.current),
    }
  }
}
