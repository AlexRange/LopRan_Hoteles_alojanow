import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelesClienteComponent } from './hoteles-cliente.component';

describe('HotelesClienteComponent', () => {
  let component: HotelesClienteComponent;
  let fixture: ComponentFixture<HotelesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelesClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
