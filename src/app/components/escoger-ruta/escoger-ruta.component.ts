import { Component, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { Vuelo } from 'src/app/models/vuelo';
import { Global } from 'src/app/services/global';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-escoger-ruta',
  templateUrl: './escoger-ruta.component.html',
  styleUrls: ['./escoger-ruta.component.css'],
  providers: [VuelosService]
})

export class EscogerRutaComponent implements AfterViewInit, OnInit {
  public vuelos: Vuelo[];
  public vuelosReservados: Vuelo[];
  public url: string;
  public precios: number[];
  public aux: number;
  constructor(private renderer: Renderer2, private el: ElementRef, private _vueloService: VuelosService
  ) {
    this.url = Global.url;
    this.vuelos = [];
    this.vuelosReservados = [];
    this.precios = [];
    this.aux = 0;
  }

  ngOnInit(): void {
    this.getVuelos();
  }
  getVuelos() {
    this._vueloService.getVuelos().subscribe(
      response => {
        if (response.vuelos) {
          this.vuelos = response.vuelos;
        }
      },
      error => {
        console.log(<any>error);
      }
    )
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
      for (let i = 0; i < this.vuelos.length; i++) {
        //no pagan = const menores2Value = parseInt((document.getElementById('menores2') as HTMLInputElement).value, 10);
        const entre2y25Value = parseInt((document.getElementById('entre2y25') as HTMLInputElement).value, 10);
        const entre25y65Value = parseInt((document.getElementById('entre25y65') as HTMLInputElement).value, 10);
        const mayores65Value = parseInt((document.getElementById('mayores65') as HTMLInputElement).value, 10);
        this.vuelos[i].precio =
          (this.precios[i] * 0.8) * entre2y25Value +
          entre25y65Value * this.precios[i] +
          (this.precios[i] * 0.5) * mayores65Value;
      }
    }
  }

  increase(inputId: string): void {
    const inputElement = this.el.nativeElement.querySelector(`#${inputId}`);
    const currentValue = parseInt(inputElement.value);
    const maxValue = parseInt(inputElement.getAttribute('max'));

    if (currentValue < maxValue) {
      inputElement.value = (currentValue + 1).toString();
      for (let i = 0; i < this.vuelos.length; i++) {
        //no pagan = const menores2Value = parseInt((document.getElementById('menores2') as HTMLInputElement).value, 10);
        const entre2y25Value = parseInt((document.getElementById('entre2y25') as HTMLInputElement).value, 10);
        const entre25y65Value = parseInt((document.getElementById('entre25y65') as HTMLInputElement).value, 10);
        const mayores65Value = parseInt((document.getElementById('mayores65') as HTMLInputElement).value, 10);
        this.vuelos[i].precio =
          (this.precios[i] * 0.8) * entre2y25Value +
          entre25y65Value * this.precios[i] +
          (this.precios[i] * 0.5) * mayores65Value;
      }
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = (today.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  mostrarSeccionVuelos: boolean = false;
  mostrarSeccionPasajeros: boolean = false;
  mostrarVuelos() {
    this.mostrarSeccionVuelos = true;
    this.mostrarSeccionPasajeros = true;
    for (const vuelo of this.vuelos) {
      this.precios.push(vuelo.precio);
    }
    console.log(this.precios)
  }

  selectFlight(i: number) {
    this.vuelosReservados[this.aux] = this.vuelos[i];
    this.aux++;
  }
  mostrarContenido: boolean = true;
  mostrarSeccionCarrito: boolean = false;
  abrirCarrito() {
    this.mostrarContenido = false;
    this.mostrarSeccionCarrito = true;
    this.mostrarBotonResumen = true;
  }
  exit(){
    this.mostrarContenido = true;
    this.mostrarSeccionCarrito = false;
    this.mostrarSeccionVuelos = false;
    this.mostrarSeccionPasajeros = false;
    this.mostrarSeccionResumen = false;
    this.mostrarBotonResumen = false;
  }
  mostrarSeccionResumen: boolean = false;
  mostrarBotonResumen: boolean = false;
  mostrarResumen() {
    this.mostrarSeccionResumen = true;
  }
}
