/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BarbershopService } from './barbershop.service';

describe('Service: Barbershop', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BarbershopService]
    });
  });

  it('should ...', inject([BarbershopService], (service: BarbershopService) => {
    expect(service).toBeTruthy();
  }));
});
