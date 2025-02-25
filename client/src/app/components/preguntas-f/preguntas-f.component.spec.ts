import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasFComponent } from './preguntas-f.component';

describe('PreguntasFComponent', () => {
  let component: PreguntasFComponent;
  let fixture: ComponentFixture<PreguntasFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreguntasFComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntasFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
