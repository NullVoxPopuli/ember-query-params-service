import Application from '@ember/application';
import QueryParamsService from '../services/query-params';

export function initialize(application: Application): void {
  application.register('service:queryParams', QueryParamsService);
}

export default {
  initialize,
};
