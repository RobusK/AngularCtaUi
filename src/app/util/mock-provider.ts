import {Type} from '@angular/core';
import {instance, mock} from 'ts-mockito';

export const mockProvider = <T>(
  toMock: Type<T>,
  setupMock: (m: T) => void
): {
  provide: Type<T>;
  useFactory: () => T;
} => {
  const m = mock(toMock);
  setupMock(m);
  return {provide: toMock, useFactory: () => instance(m)};
};
