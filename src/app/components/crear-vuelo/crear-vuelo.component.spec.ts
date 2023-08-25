import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearVueloComponent } from './crear-vuelo.component';

describe('CrearVueloComponent', () => {
  let component: CrearVueloComponent;
  let fixture: ComponentFixture<CrearVueloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearVueloComponent]
    });
    fixture = TestBed.createComponent(CrearVueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
