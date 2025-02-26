import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPComponent } from './add-p.component';

describe('AddPComponent', () => {
  let component: AddPComponent;
  let fixture: ComponentFixture<AddPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
