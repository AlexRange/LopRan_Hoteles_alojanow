import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAHotelComponent } from './asignar-a-hotel.component';

describe('AsignarAHotelComponent', () => {
  let component: AsignarAHotelComponent;
  let fixture: ComponentFixture<AsignarAHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignarAHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarAHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
