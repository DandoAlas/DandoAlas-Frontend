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
  }
}
