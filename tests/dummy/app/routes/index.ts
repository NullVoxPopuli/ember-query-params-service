import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { QueryParamsService } from 'ember-query-params-service';

export default class ApplicationIndexRoute extends Route {
  @service('query-params') qp!: QueryParamsService;

  model() {
    console.log('Application index model');
    return {
      QPs: JSON.stringify(this.qp.current),
    };
  }
}
