import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pasajero } from 'src/app/models/pasajero';
import { Vuelo } from 'src/app/models/vuelo';
import { Global } from 'src/app/services/global';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-crear-vuelo',
  templateUrl: './crear-vuelo.component.html',
  styleUrls: ['./crear-vuelo.component.css'],
  providers: [VuelosService]
})
export class CrearVueloComponent {
  public horas: number[] = [];
  public titulo: string;
  public vuelo!: Vuelo;
  //public vueloGuardar: Vuelo;
  public url: string;
  public status: string;
  //public idGuardado: string;
  public contadorVuelos!: number;
  public pasajeros: Pasajero[];
  constructor(private renderer: Renderer2, private el: ElementRef, private _vueloService: VuelosService) {
    for (let i = 1; i <= 24; i++) {
      this.horas.push(i);
    }
    this.titulo = "GUARDAR";
    this.url = Global.url;
    this.status = "";
    this.pasajeros = [];
    this._vueloService.getUltimoNumeroVuelo().subscribe(
      ultimoNumero => {
        this.contadorVuelos = ultimoNumero + 1; // Inicializa el contador con el último número + 1
        this.vuelo = new Vuelo('', this.contadorVuelos, '', '', '', '', '', 1, '1', this.pasajeros, 65, '', 30, '', true);
      },
      error => {
        console.log("Error al obtener el último número de vuelo:", error);
        this.contadorVuelos = 1;
      }
    );
    console.log(this.vuelo);
  }
  public showSuccessAlert: boolean = false;
  guardarVuelo(form: NgForm) {
    this._vueloService.guardarVuelo(this.vuelo).subscribe(
      response => {
        if (response.vuelo) {
          this.status = 'success';
          this.showSuccessAlert = true; // Mostrar la alerta de éxito
          this.incrementarContadorVuelos();
          setTimeout(() => {
            this.showSuccessAlert = false; // Ocultar la alerta después de 3 segundos
          }, 6000); // 3000 milisegundos = 3 segundos

          console.log(response.vuelo._id);
          //form.reset();
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  incrementarContadorVuelos() {
    this.contadorVuelos++;
    this.vuelo = new Vuelo('', this.contadorVuelos, '', '', '', '', '', 1, '1', [], 65, '', 30, '', true);
  }
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = (today.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
