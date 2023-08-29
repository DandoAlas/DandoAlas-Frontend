import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionVueloComponent } from './informacion-vuelo.component';

describe('InformacionVueloComponent', () => {
  let component: InformacionVueloComponent;
  let fixture: ComponentFixture<InformacionVueloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionVueloComponent]
    });
    fixture = TestBed.createComponent(InformacionVueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
