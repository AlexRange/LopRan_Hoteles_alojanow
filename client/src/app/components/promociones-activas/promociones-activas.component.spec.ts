import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionesActivasComponent } from './promociones-activas.component';

describe('PromocionesActivasComponent', () => {
  let component: PromocionesActivasComponent;
  let fixture: ComponentFixture<PromocionesActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PromocionesActivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromocionesActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
