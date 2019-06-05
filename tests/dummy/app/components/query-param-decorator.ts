import Component from "@glimmer/component";
import { queryParam } from "ember-query-params-service/utils/query-param";
import { action } from '@ember/object';

export default class QueryParamDecoratorTest extends Component {
  @queryParam("foo", {
    fromString: (qp) =>  parseInt(( qp || '' ).replace(/-/g, '')),
    toString: (value) => `-${value}-`,
  })
  foo?: number;

  @queryParam("bar", {
    fromString: (qp) =>  parseInt(qp),
  }) bar?: number;

  @action addToFoo() {
    this.foo = (this.foo || 0) + 1;
  }

  @action addToBar() {
    this.bar = (this.bar || 0) + 1;
  }

  @action fooToZero() {
    this.foo = 0;
  }

  @action barToZero() {
    this.bar = 0;
  }

  @action clearFoo() {
    this.foo = undefined;
  }

  @action clearBar() {
    this.bar = undefined;
  }
}
