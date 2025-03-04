import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelesDesComponent } from './hoteles-des.component';

describe('HotelesDesComponent', () => {
  let component: HotelesDesComponent;
  let fixture: ComponentFixture<HotelesDesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelesDesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelesDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
