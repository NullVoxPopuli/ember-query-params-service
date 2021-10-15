import Component from '@glimmer/component';
import { action } from '@ember/object';

import { queryParam } from 'ember-query-params-service';

export default class QueryParamDecoratorTest extends Component {
  @queryParam({
    deserialize: (qp: string) => parseInt((qp || '-1').replace(/-/g, '')),
    serialize: (value: number) => `-${value || 'not set'}-`,
  })
  foo?: number;

  @queryParam bar?: number;

  @queryParam('strongest-avenger') strongestAvenger: string | undefined = 'Captain Marvel';

  @action addToFoo() {
    this.foo = (this.foo || 0) + 1;
  }

  @action addToBar() {
    this.bar = (this.bar || 0) + 1;
  }

  @action fooToZero() {
    this.foo = 1;
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

  @action thorWalksIn() {
    this.strongestAvenger = 'Thor';
  }

  @action clearStrongestAvenger() {
    this.strongestAvenger = undefined;
  }
}
