import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHabitComponent } from './update-habit.component';

describe('UpdateHabitComponent', () => {
  let component: UpdateHabitComponent;
  let fixture: ComponentFixture<UpdateHabitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateHabitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
