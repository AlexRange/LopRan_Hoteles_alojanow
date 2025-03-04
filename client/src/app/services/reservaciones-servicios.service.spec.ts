import { TestBed } from '@angular/core/testing';

import { ReservacionesServiciosService } from './reservaciones-servicios.service';

describe('ReservacionesServiciosService', () => {
  let service: ReservacionesServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservacionesServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
