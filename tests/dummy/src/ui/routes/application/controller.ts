import Controller from '@ember/controller';


export default class extends Controller {
  queryParams = ['a', 'b'];
  a = '';
  b = '';
}
