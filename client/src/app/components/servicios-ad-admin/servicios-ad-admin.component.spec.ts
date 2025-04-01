import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosAdAdminComponent } from './servicios-ad-admin.component';

describe('ServiciosAdAdminComponent', () => {
  let component: ServiciosAdAdminComponent;
  let fixture: ComponentFixture<ServiciosAdAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiciosAdAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosAdAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
