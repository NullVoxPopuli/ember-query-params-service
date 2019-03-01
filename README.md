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
# ember install ember-query-params-service # (not yet)
ember install github:NullVoxPopuli/ember-query-params-service
```


Usage
------------------------------------------------------------------------------

### _The `@queryParam` Decorator_

```ts
import Route from '@ember/routing/route';
import { queryParam } from 'ember-query-params-service';

export default class ApplicationRoute extends Route {
  @queryParam('r') isSpeakerNotes;
  @queryParams('slide') slideNumber;
  
  model() {
    return {
      isSpeakerNotes: this.isSpeakerNotes,
      slideNumber: this.slideNumber
    }
  }
}
```

```hbs
{{this.model.isSpeakerNotes}} - {{this.model.slideNumber}}
```

### _Expanded usage with the service_

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { alias } from 'ember-query-params-service';


export default class ApplicationRoute extends Route {
  @service queryParams;

  @alias('queryParams.current.r') isSpeakerNotes;
  @alias('queryParams.current.slide') slideNumber;
  
  model() {
    return {
      isSpeakerNotes: this.isSpeakerNotes,
      slideNumber: this.slideNumber
    }
  }
}
```


### **Setting Query Params**

 - Directly on the service:

    ```ts
      @service queryParams;

      // ...somewhere
      this.queryParams.current.queryParamName = 'some value';
    ```
    and then the URL will show `queryParamName=some%20value`

 - or via the `@alias` decorator:

    ```ts
      @alias('queryParams.current.r') isSpeakerNotes;

      // ...somewhere
      this.isSpeakerNotes = false;
    ```
    and then the URL will show `r=false`


 - or via the `@queryParam` decorator:

    ```ts
      @queryParam('r') isSpeakerNotes;

      // ...somewhere
      this.isSpeakerNotes = false;
    ```
    and then the URL will show `r=false`



## API

 - `queryParams.current` - the current set of query params for the currentURL

 - `queryParams.byPath` - query params for every route that has been visited since the last refresh

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
