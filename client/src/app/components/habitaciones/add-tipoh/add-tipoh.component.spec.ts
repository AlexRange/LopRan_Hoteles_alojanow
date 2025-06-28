import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipohComponent } from './add-tipoh.component';

describe('AddTipohComponent', () => {
  let component: AddTipohComponent;
  let fixture: ComponentFixture<AddTipohComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTipohComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTipohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
