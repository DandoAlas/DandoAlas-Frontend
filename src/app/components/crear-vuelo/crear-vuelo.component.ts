import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-crear-vuelo',
  templateUrl: './crear-vuelo.component.html',
  styleUrls: ['./crear-vuelo.component.css']
})
export class CrearVueloComponent implements AfterViewInit {

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
    const selectSalida = this.el.nativeElement.querySelector('.salida');
    const selectLlegada = this.el.nativeElement.querySelector('.llegada');

    for (let i = 1; i <= 24; i++) {
      const option = this.renderer.createElement('option');
      this.renderer.setProperty(option, 'value', i);
      this.renderer.setProperty(option, 'textContent', i.toString());
      this.renderer.appendChild(selectSalida, option);

      const option2 = this.renderer.createElement('option');
      this.renderer.setProperty(option2, 'value', i);
      this.renderer.setProperty(option2, 'textContent', i.toString());
      this.renderer.appendChild(selectLlegada, option2);
    }
  }
}
