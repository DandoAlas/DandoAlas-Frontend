import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Vuelo } from 'src/app/models/vuelo';
import { Global } from 'src/app/services/global';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-escoger-ruta',
  templateUrl: './escoger-ruta.component.html',
  styleUrls: ['./escoger-ruta.component.css'],
  providers:[VuelosService]
})
export class EscogerRutaComponent implements AfterViewInit {
  constructor(private renderer: Renderer2, private el: ElementRef, private _vueloService: VuelosService
  ) {
  }

  ngAfterViewInit(): void {
    const checkboxes = this.el.nativeElement.querySelectorAll('.checkbox-input');
    const fechaRegreso = this.el.nativeElement.querySelector('.fechaRegreso');
    checkboxes.forEach((checkbox: HTMLElement) => {
      this.renderer.listen(checkbox, 'change', () => {
        checkboxes.forEach((otherCheckbox: HTMLElement) => {
          if (otherCheckbox !== checkbox) {
            (otherCheckbox as HTMLInputElement).checked = false;
          } else {
            if (checkbox.id === 'ida') {
              fechaRegreso.disabled = true;
            } else {
              fechaRegreso.disabled = false;
            }
          }
        });
      });
    });
  }

  decrease(inputId: string): void {
    const inputElement = this.el.nativeElement.querySelector(`#${inputId}`);
    const currentValue = parseInt(inputElement.value);

    if (currentValue > 0) {
      inputElement.value = (currentValue - 1).toString();
    }
  }

  increase(inputId: string): void {
    const inputElement = this.el.nativeElement.querySelector(`#${inputId}`);
    const currentValue = parseInt(inputElement.value);
    const maxValue = parseInt(inputElement.getAttribute('max'));

    if (currentValue < maxValue) {
      inputElement.value = (currentValue + 1).toString();
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = (today.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
