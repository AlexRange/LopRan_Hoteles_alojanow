import { TestBed } from '@angular/core/testing';

import { ServiciosAdicionalesService } from './servicios-adicionales.service';

describe('ServiciosAdicionalesService', () => {
  let service: ServiciosAdicionalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosAdicionalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
