import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosCComponent } from './comentarios-c.component';

describe('ComentariosCComponent', () => {
  let component: ComentariosCComponent;
  let fixture: ComponentFixture<ComentariosCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComentariosCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentariosCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
