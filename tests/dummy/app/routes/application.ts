import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import QueryParamsService from 'ember-query-params-service/services/query-params';

export default class ApplicationRoute extends Route {
  @service queryParams!: QueryParamsService;

  model() {
    return {
      QPs: JSON.stringify(this.queryParams.current)
    };
  }
}
