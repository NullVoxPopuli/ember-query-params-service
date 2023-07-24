import 'ember-source/types';
import 'ember-source/types/preview';
import '@glint/environment-ember-loose';

import type { HelperLike } from '@glint/template';

declare module '@ember-decorators/utils/decorator' {
  export function decoratorWithParams<Fn>(fn: Fn): void;
}

declare module '@glint/environment-ember-loose/registry' {
  // Remove this once entries have been added! 👇
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export default interface Registry {
    // Add any registry entries from other addons here that your addon itself uses (in non-strict mode templates)
    // See https://typed-ember.gitbook.io/glint/using-glint/ember/using-addons
    'page-title': HelperLike<{ Args: { Positional: [string] }; Return: string }>;
  }
}
