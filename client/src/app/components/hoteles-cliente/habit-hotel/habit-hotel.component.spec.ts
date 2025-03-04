import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitHotelComponent } from './habit-hotel.component';

describe('HabitHotelComponent', () => {
  let component: HabitHotelComponent;
  let fixture: ComponentFixture<HabitHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
