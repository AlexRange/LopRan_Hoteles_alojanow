import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHComponent } from './add-h.component';

describe('AddHComponent', () => {
  let component: AddHComponent;
  let fixture: ComponentFixture<AddHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
