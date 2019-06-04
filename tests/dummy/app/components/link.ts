import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

export default class Link extends Component {
  @service router!: RouterService;

  get url() {
    let { to, queryParams } = this.args;

    return this.router.urlFor(to, { queryParams });
  }

  onClick(e: Event) {
    e.preventDefault();

    let { to, queryParams } = this.args;

    this.router.transitionTo(to, { queryParams });
  }
}
