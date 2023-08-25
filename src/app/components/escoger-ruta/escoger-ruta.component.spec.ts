import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscogerRutaComponent } from './escoger-ruta.component';

describe('EscogerRutaComponent', () => {
  let component: EscogerRutaComponent;
  let fixture: ComponentFixture<EscogerRutaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EscogerRutaComponent]
    });
    fixture = TestBed.createComponent(EscogerRutaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
