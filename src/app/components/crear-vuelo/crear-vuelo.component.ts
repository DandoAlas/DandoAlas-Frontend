import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Vuelo } from 'src/app/models/vuelo';
import { Global } from 'src/app/services/global';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-crear-vuelo',
  templateUrl: './crear-vuelo.component.html',
  styleUrls: ['./crear-vuelo.component.css'],
  providers: [VuelosService]
})
export class CrearVueloComponent implements AfterViewInit {
  public titulo: string;
  public vuelo: Vuelo;
  //public vueloGuardar: Vuelo;
  public url: string;
  public status: string;
  //public idGuardado: string;
  constructor(private renderer: Renderer2, private el: ElementRef, private _vueloService: VuelosService) {
    this.titulo = "GUARDAR";
    this.url = Global.url;
    this.vuelo = new Vuelo('', 0, '', '', '', '', '', '', '', '', [], 65, '', true);
    //this.vueloGuardar = new Vuelo('', 0, '', '', '', '', '', '', '', '', [], 65, '', true);
    this.status = "";
    //this.idGuardado = "";
  }
  guardarVuelo(form: NgForm) {
      this._vueloService.guardarVuelo(this.vuelo).subscribe(
        response => {
          if (response.vuelo) {
                //this.vueloGuardar = result.response;
                this.status = 'success';
                console.log(response.vuelo._id);
                //this.idGuardado = result.zapato._id;
                form.reset();
          } else {
            this.status = 'failed';
            console.log("casi");
          }
        },
        error => {
          console.log(<any>error);
        }
      )
  }
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
    const selectSalida = this.el.nativeElement.querySelector('.horaSalida');
    const selectLlegada = this.el.nativeElement.querySelector('.horaLlegada');

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
