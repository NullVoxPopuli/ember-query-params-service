import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class QueryParamComplexChild extends Component {
  @service queryParams;
  
  get baz() {
    return this.queryParams.current.baz;
  }
}
