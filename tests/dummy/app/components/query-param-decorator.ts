import Component from "@glimmer/component";
import { queryParam } from "ember-query-params-service";

export default class QueryParamDecoratorTest extends Component {
  @queryParam("foo", {
    deserialize: (qp) =>  parseInt(qp)
  })
  foo;

  @queryParam("bar") bar;

  addToFoo() {
    this.foo = (this.foo || 0) + 1;
  }

  addToBar() {
    this.bar = (this.bar || 0) + 1;
  }

  clearFoo() {
    this.foo = 0;
  }

  clearBar() {
    this.bar = 0;
  }
}
