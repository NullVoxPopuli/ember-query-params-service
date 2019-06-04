import Component from "@glimmer/component";
import { queryParam } from "ember-query-params-service/utils/query-param";
import { action } from '@ember/object';

export default class QueryParamDecoratorTest extends Component {
  @queryParam("foo", {
    deserialize: (qp) =>  parseInt(qp)
  })
  foo!: number;

  @queryParam("bar") bar!: number;

  @action addToFoo() {
    this.foo = (this.foo || 0) + 1;
  }

  @action addToBar() {
    this.bar = (this.bar || 0) + 1;
  }

  @action clearFoo() {
    this.foo = 0;
  }

  @action clearBar() {
    this.bar = 0;
  }
}
