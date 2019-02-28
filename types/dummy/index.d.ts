// https://tc39.github.io/proposal-decorators/#sec-elementdescriptor-specification-type
interface ElementDescriptor {
  descriptor: PropertyDescriptor;
  initializer?: () => any; // unknown
  key: string;
  kind: 'method' | 'field' | 'initializer';
  placement: 'own' | 'prototype' | 'static';
  finisher?: (klass: any) => any;
}

interface IMethodDecorator {
  descriptor: PropertyDescriptor;
  key: string;
  kind: 'method' | 'field' | 'initializer';
  placement: 'own' | 'prototype' | 'static';
}

type Dict<T = unknown> = {
  [key: string]: T
};
