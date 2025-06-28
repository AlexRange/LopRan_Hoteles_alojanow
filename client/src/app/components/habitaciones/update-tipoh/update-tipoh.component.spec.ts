import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTipohComponent } from './update-tipoh.component';

describe('UpdateTipohComponent', () => {
  let component: UpdateTipohComponent;
  let fixture: ComponentFixture<UpdateTipohComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTipohComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTipohComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
