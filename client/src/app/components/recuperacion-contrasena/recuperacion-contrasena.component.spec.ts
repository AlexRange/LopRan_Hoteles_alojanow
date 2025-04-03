import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperacionContrasenaComponent } from './recuperacion-contrasena.component';

describe('RecuperacionContrasenaComponent', () => {
  let component: RecuperacionContrasenaComponent;
  let fixture: ComponentFixture<RecuperacionContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperacionContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperacionContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
