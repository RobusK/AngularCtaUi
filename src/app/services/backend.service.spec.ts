import {Apollo} from 'apollo-angular';
import {TestBed} from '@angular/core/testing';

import {BackendService} from './backend.service';
import {anything, instance, mock, when} from 'ts-mockito';
import {LocationService} from './location.service';
import {NEVER, of} from 'rxjs';
import {mockProvider} from '../util/mock-provider';


describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        mockProvider(LocationService, m =>
          when(m.getPosition()).thenReturn(of({latitude: 123, longitude: 123} as any))
        ),
        mockProvider(Apollo, m =>
          when(m.query(anything())).thenReturn(NEVER)
        )
      ]
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
