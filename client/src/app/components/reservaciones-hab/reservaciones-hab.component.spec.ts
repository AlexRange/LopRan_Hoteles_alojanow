import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservacionesHabComponent } from './reservaciones-hab.component';

describe('ReservacionesHabComponent', () => {
  let component: ReservacionesHabComponent;
  let fixture: ComponentFixture<ReservacionesHabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservacionesHabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservacionesHabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
