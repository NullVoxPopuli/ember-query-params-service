ember-query-params-service
==============================================================================

[![Build Status](https://travis-ci.com/NullVoxPopuli/ember-query-params-service.svg?branch=master)](https://travis-ci.com/NullVoxPopuli/ember-query-params-service)


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.9 or above
* Ember CLI v3.9 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-query-params-service
```


Usage
------------------------------------------------------------------------------

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service queryParams;

  model() {
    return {
      QPs: JSON.stringify(this.queryParams.current),
    }
  }
}
```

```hbs
{{this.model.QPs}}
```

and then visiting `/?a=1&b=2` will show:

```
{ 
  a: 1,
  b: 2
}
```

### **Setting Query Params**

```ts
  @service queryParams;

  // ...somewhere
  this.queryParams.current.queryParamName = 'some value';
```
and then the URL will show `queryParamName=some%20value`

## API

 - `queryParams.current` - the current set of query params for the currentURL

 - `queryParams.byPath` - query params for every route that has been visited since the last refresh

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
