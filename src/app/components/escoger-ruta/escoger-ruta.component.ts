import { Component, AfterViewInit, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pago } from 'src/app/models/pago';
import { Pasajero } from 'src/app/models/pasajero';
import { Usuario } from 'src/app/models/usuario';
import { Vuelo } from 'src/app/models/vuelo';
import { Global } from 'src/app/services/global';
import { PagoService } from 'src/app/services/pago.service';
import { PasajeroService } from 'src/app/services/pasajero.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VuelosService } from 'src/app/services/vuelo.service';

@Component({
  selector: 'app-escoger-ruta',
  templateUrl: './escoger-ruta.component.html',
  styleUrls: ['./escoger-ruta.component.css'],
  providers: [VuelosService, PasajeroService, UsuarioService, PagoService]
})

export class EscogerRutaComponent implements AfterViewInit, OnInit {
  public vuelos: Vuelo[];
  public vuelosReservados: Vuelo[];
  public url: string;
  public precios: number[];
  public aux: number;
  //pasajero
  public pasajero!: Pasajero;
  public cantidadPasajeros: number;
  public status: string;
  //usuario
  public usuario!: Usuario;
  public pago!: Pago;
  constructor(private renderer: Renderer2, private el: ElementRef,
    private _vueloService: VuelosService,
    private _pasajeroService: PasajeroService,
    private _pagoService: PagoService,
    private _usuarioService: UsuarioService
  ) {
    this.url = Global.url;
    this.vuelos = [];
    this.vuelosReservados = [];
    this.precios = [];
    this.aux = 0;
    this.cantidadPasajeros = 1;
    this.status = "";
    this.pasajero = new Pasajero('', '', '', 0);
    this.usuario = new Usuario('', '', 0, '');;
    this.pago = new Pago(this.usuario.nombreApellido, 0, '');
  }

  ngOnInit(): void {
    //this.getVuelos();
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
  esRegreso: boolean = false;
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
              this.esRegreso = true;
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
      this.cantidadPasajeros--;
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
      this.cantidadPasajeros++;
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
  noExistenVuelos: boolean = false;
  mostrarVuelos() {
    this._vueloService.getVuelosConFiltros(this.origen, this.destino, this.fechaSalida).subscribe(
      response => {
        if (response.vuelos) {
          this.vuelos = response.vuelos;
          if (this.vuelos.length === 0) {
            this.noExistenVuelos = true;
            setTimeout(() => {
              this.noExistenVuelos = false;
            }, 6000);
          } else {
            this.mostrarSeccionVuelos = true;
            this.mostrarSeccionPasajeros = true;
            for (const vuelo of this.vuelos) {
              this.precios.push(vuelo.precio);
            }
            console.log(this.precios);
          }
        }
      },
      error => {
        console.log(<any>error);
        this.noExistenVuelos = true;
        setTimeout(() => {
          this.noExistenVuelos = false;
        }, 6000);
      }
    );
  }
  public beneficiosTurista: boolean = false;
  public beneficiosPrimera: boolean = false;
  selectFlight(i: number) {
    this.vuelosReservados[this.aux] = this.vuelos[i];
    this.aux++;
    this.beneficiosTurista = true;
    if (this.esRegreso) {
      this.esRegreso = false;
      this._vueloService.getVuelosConFiltros(this.destino, this.origen, this.fechaRegreso).subscribe(
        response => {
          if (response.vuelos) {
            this.vuelos = response.vuelos;
            if (this.vuelos.length === 0) {
              this.noExistenVuelos = true;
              setTimeout(() => {
                this.noExistenVuelos = false;
              }, 6000);
            } else {
              this.mostrarSeccionVuelos = true;
              for (const vuelo of this.vuelos) {
                this.precios.push(vuelo.precio);
              }
              console.log(this.precios);
            }
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    } else {
      this.mostrarSeccionVuelos = false;
      this.mostrarSeccionPasajeros = false;
      this.mostrarPasajero();
    }
    //this.beneficiosPrimera = true;
    setTimeout(() => {
      //this.beneficiosPrimera = false;
      this.beneficiosTurista = false;
    }, 20000);
  }

  public origen: string = '';
  public destino: string = '';
  public fechaSalida: string = '';
  public fechaRegreso: string = '';
  public clase: string = '';

  buscarVuelosConFiltros() {
  }

  mostrarContenido: boolean = true;
  mostrarSeccionCarrito: boolean = false;
  abrirCarrito() {
    this.mostrarContenido = false;
    this.mostrarSeccionCarrito = true;
    this.mostrarBotonResumen = true;
  }
  exit() {
    this.mostrarContenido = true;
    this.mostrarSeccionCarrito = false;
    this.mostrarSeccionVuelos = false;
    this.mostrarSeccionPasajeros = false;
    this.mostrarSeccionResumen = false;
    this.mostrarBotonResumen = false;
  }
  mostrarSeccionResumen: boolean = false;
  mostrarSeccionResumenP: boolean = false;
  mostrarBotonResumen: boolean = false;
  mostrarResumen() {
    this.mostrarSeccionResumen = true;
  }
  mostrarResumenP() {
    this.mostrarSeccionResumenP = true;
  }

  //pasajeros
  mostrarInformacionPasajero: boolean = false;
  i: number = 1;
  mostrarPasajero() {
    this.mostrarInformacionPasajero = true;
  }
  guardarPasajero(form: NgForm) {
    this._pasajeroService.guardarPasajero(this.pasajero).subscribe(
      response => {
        if (response.pasajero) {
          this.status = 'success';
          console.log(response.pasajero._id);
          form.reset();
          console.log(this.pasajero);
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  getRange(num: number): number[] {
    return new Array(num);
  }
  //pago
  aux1: number = 1;
  mostrarPago() {
    if (this.aux1 === this.cantidadPasajeros) {
      this.mostrarInformacionPasajero = false;
      this.mostrarInformacionUsuario = true;
      this.mostrarBotonesPago = true;
    }
    this.aux1++;
  }
  /*contacto*/
  mostrarInformacionUsuario: boolean = false;
  mostrarBotonesPago: boolean = false;
  guardarUsuario(form: NgForm) {
    this._usuarioService.guardarUsuario(this.usuario).subscribe(
      response => {
        if (response.usuario) {
          this.status = 'success';
          console.log(response.usuario._id);
          form.reset();
          console.log(this.usuario);
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  mostrarBotonPago: boolean = false;
  mostrarBotones() {
    this.mostrarBotonPago = true;
  }

  
  guardarPago(form: NgForm) {
    this._pagoService.guardarPago(this.pago).subscribe(
      response => {
        if (response.pago) {
          this.status = 'success';
          console.log(response.pago._id);
          form.reset();
          console.log(this.pago);
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  mostrarPagoT: boolean = false;
  mostrarPagoTotal() {
    this.mostrarPagoT = true;
  }
}
