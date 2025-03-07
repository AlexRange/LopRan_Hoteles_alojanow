import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesClienteComponent } from './reservaciones-cliente.component';

describe('ReservacionesClienteComponent', () => {
  let component: ReservacionesClienteComponent;
  let fixture: ComponentFixture<ReservacionesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservacionesClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservacionesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
