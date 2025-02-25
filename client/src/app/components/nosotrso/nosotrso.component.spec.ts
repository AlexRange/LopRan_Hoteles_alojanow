import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NosotrsoComponent } from './nosotrso.component';

describe('NosotrsoComponent', () => {
  let component: NosotrsoComponent;
  let fixture: ComponentFixture<NosotrsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NosotrsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NosotrsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
