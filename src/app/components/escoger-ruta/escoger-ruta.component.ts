import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-escoger-ruta',
  templateUrl: './escoger-ruta.component.html',
  styleUrls: ['./escoger-ruta.component.css']
})
export class EscogerRutaComponent implements AfterViewInit {

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngAfterViewInit(): void {
    const searchInput = this.el.nativeElement.querySelector('.search input[type="text"]');
    this.renderer.listen(searchInput, 'focus', () => {
      if (searchInput.value === "Buscar") {
        searchInput.value = "";
      }
    });
    this.renderer.listen(searchInput, 'blur', () => {
      if (searchInput.value.trim() === "") {
        searchInput.value = "Buscar";
      } else {
        searchInput.value = "Buscar";
      }
    });

    const checkboxes = this.el.nativeElement.querySelectorAll('.checkbox-input');
    const fechaRegreso = this.el.nativeElement.querySelector('.fecha-regreso');
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
}
