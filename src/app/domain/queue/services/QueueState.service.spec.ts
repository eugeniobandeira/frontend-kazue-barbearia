/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueueStateService } from './QueueState.service';

describe('Service: QueueState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueueStateService]
    });
  });

  it('should ...', inject([QueueStateService], (service: QueueStateService) => {
    expect(service).toBeTruthy();
  }));
});
