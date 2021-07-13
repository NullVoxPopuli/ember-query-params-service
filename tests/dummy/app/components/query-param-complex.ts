import Component from '@glimmer/component';
import { queryParam } from 'ember-query-params-service';
import { action } from '@ember/object';

export default class QueryParamComplex extends Component {
  @queryParam
  baz;

  constructor() {
    super(...arguments);
    this.baz = { state: 'old' };
  }

  @action
  updateQueryParam() {
    this.baz = { state: 'new' };
  }
}
