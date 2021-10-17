ember-query-params-service
==============================================================================

[![Build Status](https://travis-ci.com/NullVoxPopuli/ember-query-params-service.svg?branch=master)](https://travis-ci.com/NullVoxPopuli/ember-query-params-service)
[![Maintainability](https://api.codeclimate.com/v1/badges/365a007a466d799748bf/maintainability)](https://codeclimate.com/github/NullVoxPopuli/ember-query-params-service/maintainability)
[![Ember Observer Score](https://emberobserver.com/badges/ember-query-params-service.svg)](https://emberobserver.com/addons/ember-query-params-service) 
[![npm](https://img.shields.io/npm/v/ember-query-params-service.svg)](https://www.npmjs.com/package/ember-query-params-service)

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.11 or above
* Ember CLI v3.11 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-query-params-service
```


### DISCLAIMER

This package is a work in progress and while it provides a more ergonomic way to access query params from anywhere in the app, there is still a dependency on controllers if you want to be able to link to routes with query params. This is due to an allow-list that's implemented in the route  resolver.  

RFC here: https://github.com/emberjs/rfcs/pull/380

Also, this is an experiment, and SemVer guarantees cannot be assured (yet).

Usage
------------------------------------------------------------------------------

### _The `@queryParam` Decorator_

Signature:
```ts
@queryParam: void;
@queryParam(param: string);
@queryParam(param: string, options: TransformOptions);
@queryParam(options: TransformOptions);

TransformOptions<T> = {
  defaultValue?: any;
  deserialize?: (param: string) => T;
  serialize?: (value: T) => string;
}
```

example:

```ts
import Route from '@ember/routing/route';
import { queryParam } from 'ember-query-params-service';

export default class ApplicationRoute extends Route {
  @queryParam isSpeakerNotes;
  @queryParam slideNumber;

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

optionally, an options hash may be passed to the decorator defining any of the three options, 
defaultValue, serialize, deserialize. 

An example of using the default value would be:

```ts
import Component from "@glimmer/component";
import { queryParam } from "ember-query-params-service";

export default class SomeComponent extends Component {
  @queryParam({
    defaultValue: false,
  })
  active;

}
```
When the value is undefined, the defaultValue will be used when accessing the value

When the value is undefined or equal to the defaultValue, the param will not be present on the URL. 
In this way the URL will only contain params that are different than the default value. 


An example of using serialize / deserialize would be:

```ts
import Component from "@glimmer/component";
import { queryParam } from "ember-query-params-service";

export default class SomeComponent extends Component {
  @queryParam({
    deserialize: (qp) =>  parseInt(( qp || '' ).replace(/-/g, '')),
    serialize: (value) => `-${value}-`,
  })
  foo;

   addToFoo() {
    this.foo = (this.foo || 0) + 1;
  }
}
```

this would not only allow numeric operations on the query param (whereas, by default, query params are all strings), but it also allows any sort of transform to occur between the queryParam in the URL and the property that you want to interact with.

### _Expanded usage with the service_

```ts
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';


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
      @queryParam isSpeakerNotes;

      // ...somewhere
      this.isSpeakerNotes = false;
    ```
    and then the URL will show `isSpeakerNotes=false`
    
 - or via the `@queryParam` decorator with renaming the param in the URL
 
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
