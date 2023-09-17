import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
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
import { render } from 'creditcardpayments/creditCardPayments';
import { transition } from '@angular/animations';

@Component({
  selector: 'app-escoger-ruta',
  templateUrl: './escoger-ruta.component.html',
  styleUrls: ['./escoger-ruta.component.css'],
  providers: [VuelosService, PasajeroService, UsuarioService, PagoService],
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
  public _idUsuario: string = '';

  //valor Total
  public valorTotal: number = 0;

  //valorTotal
  public valorTotal: number;

  //ASIENTOS
  rows: any[] = [];
  disabledCheckboxes: string[] = [];
  selected: number = 0;
  isRandomActive = false;
  public eventListenersAttached: boolean = false;
  @Input() maxSelectedCheckboxes: number = 1;
  @ViewChild('seatsContainer') seatsContainer!: ElementRef;
  @Output() emitArrayAsientos = new EventEmitter<string[]>();
  allCheckboxes: HTMLInputElement[] = [];
  habilitadoImageSrc: string = '../assets/habilitado.jpg';
  desHabilitadoImageSrc: string = '../assets/desHabilitado.jpg';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
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
    this.status = '';
    this.pasajero = new Pasajero('', '', '', 0);
    this.usuario = new Usuario('', '', 0, '');
    this.usuario = new Usuario('', '', 0, '');
    this.pago = new Pago(this.usuario.nombreApellido, 0, '');
    this.valorTotal = 0;

    //ASIENTOS
    for (let rowNumber = 1; rowNumber <= 9; rowNumber++) {
      const seats = ['A', 'B', 'C', 'D', 'E', 'F']; // Asientos de A a F por fila
      const row = {
        rowNumber: rowNumber,
        seats: seats.map(seat => ({
          id: `${rowNumber}${seat}`,
          selected: true,
          enabled: true, // Inicialmente, todos los asientos están habilitados
          imageSrc: this.habilitadoImageSrc // Inicialmente, se muestra la imagen habilitada
        }))
      };
      this.rows.push(row);
    }
    console.log(this.rows);
  }

  ngOnInit(): void {
    this.getVuelos();
  }

  async getUser() {
    
    if(this._idUsuario === ''){
      console.log("No hay usuario");
      return;
    } 
    const user = await fetch(`http://localhost:3600/obtener-usuario/${this._idUsuario}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido JSON
      },
    });

    return user.json();
  }

  async paypalButton() {

    console.log(this.vuelosReservados);

    const response = await fetch('http://localhost:3600/create-order', {
      method: 'POST',
      body: JSON.stringify({
        value: this.valorTotal.toString()
      }),
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido JSON
      },
    });

    const data = await response.json();
    const paypalWindow = window.open(
      data.links[1].href,
      'PaypalPopup',
      'width=500,height=800'
    );

    if (paypalWindow) {
      // Agrega esta comprobación para evitar el error
      const checkWindowClosed = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(checkWindowClosed);
          // Después de que se cierre la ventana de PayPal, llama al endpoint /send-email
         this.sendEmail();
        }
      }, 1000); // Verifica cada segundo si la ventana de PayPal se ha cerrado
    } else {
      // Maneja la respuesta en caso de que no sea 200, por ejemplo, mostrando un mensaje de error.
      console.error('Error en la solicitud:', response.status);
    }
  }

  async sendEmail() {
    const dataUser = await this.getUser();

    fetch('http://localhost:3600/send-email', {
      method: 'POST',
      body: JSON.stringify({
        name: dataUser.usuario.nombreApellido,
        cedula: dataUser.usuario.cedula,
        email: dataUser.usuario.correo,
        value: this.valorTotal.toString(),
        origen: this.vuelosReservados[0].origen,
        destino: this.vuelosReservados[0].destino,
        fechaSalida: this.vuelosReservados[0].fechaSalida,
        horaSalida: this.vuelosReservados[0].horaSalida,
        duracionVuelo: this.vuelosReservados[0].duracionVuelo,
        nombreAerolinea: this.vuelosReservados[0].nombreAerolinea,
        clase: this.vuelosReservados[0].clase,
      }),
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido JSON
      },
      // Puedes incluir un cuerpo si es necesario para enviar datos al endpoint /send-email
    })
      .then((emailResponse) => {
        if (emailResponse.status === 200) {
          console.log('Email enviado con éxito');
        } else {
          console.error('Error al enviar el email:', emailResponse.status);
        }
      })
      .catch((error) => {
        console.error('Error al enviar el email:', error);
      });
  }

  sumaValorTotal() {
    for (const vuelo of this.vuelosReservados) {
      this.valorTotal = this.valorTotal + vuelo.precio;
    }
  }

  sumaValorTotal(){
    for (const vuelo of this.vuelosReservados) {
      this.valorTotal = this.valorTotal + vuelo.precio;
    }
  }
  getVuelos() {
    this._vueloService.getVuelos().subscribe(
      (response) => {
        if (response.vuelos) {
          this.vuelos = response.vuelos;
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
  esRegreso: boolean = false;
  ngAfterViewInit(): void {
    const checkboxes =
      this.el.nativeElement.querySelectorAll('.checkbox-input');
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
        const entre2y25Value = parseInt(
          (document.getElementById('entre2y25') as HTMLInputElement).value,
          10
        );
        const entre25y65Value = parseInt(
          (document.getElementById('entre25y65') as HTMLInputElement).value,
          10
        );
        const mayores65Value = parseInt(
          (document.getElementById('mayores65') as HTMLInputElement).value,
          10
        );
        this.vuelos[i].precio =
          this.precios[i] * 0.8 * entre2y25Value +
          entre25y65Value * this.precios[i] +
          this.precios[i] * 0.5 * mayores65Value;
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
        const entre2y25Value = parseInt(
          (document.getElementById('entre2y25') as HTMLInputElement).value,
          10
        );
        const entre25y65Value = parseInt(
          (document.getElementById('entre25y65') as HTMLInputElement).value,
          10
        );
        const mayores65Value = parseInt(
          (document.getElementById('mayores65') as HTMLInputElement).value,
          10
        );
        this.vuelos[i].precio =
          this.precios[i] * 0.8 * entre2y25Value +
          entre25y65Value * this.precios[i] +
          this.precios[i] * 0.5 * mayores65Value;
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
    this.mostrarSeccionVuelos = true;
    this.mostrarSeccionPasajeros = true;
    for (const vuelo of this.vuelos) {
      this.precios.push(vuelo.precio);
    }
    console.log(this.precios);
    this._vueloService
      .getVuelosConFiltros(this.origen, this.destino, this.fechaSalida)
      .subscribe(
        (response) => {
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
        (error) => {
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
      this._vueloService
        .getVuelosConFiltros(this.destino, this.origen, this.fechaRegreso)
        .subscribe(
          (response) => {
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
          (error) => {
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

  buscarVuelosConFiltros() {}

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
    // this.mostrarInformacionUsuario = false;
    this.sumaValorTotal();
    console.log(this.vuelosReservados);
  }

  //pasajeros
  mostrarInformacionPasajero: boolean = false;
  i: number = 1;
  mostrarPasajero() {
    this.mostrarInformacionPasajero = true;
  }

  guardarPasajero(form: NgForm) {
    this._pasajeroService.guardarPasajero(this.pasajero).subscribe(
      (response) => {
        if (response.pasajero) {
          this.status = 'success';
          form.reset();
          console.log(this.pasajero);
        } else {
          this.status = 'failed';
        }
      },
      (error) => {
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
      //this.mostrarBotonesPago = true;
    }
    this.aux1++;
  }
  /*contacto*/
  mostrarInformacionUsuario: boolean = false;
  mostrarBotonesPago: boolean = false;

  guardarUsuario(form: NgForm) {
    this._usuarioService.guardarUsuario(this.usuario).subscribe(
      (response) => {
        if (response.usuario) {
          this._idUsuario = response.usuario._id; //Guardamos el id del usuario
          this.status = 'success';
          form.reset();
        } else {
          this.status = 'failed';
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  mostrarBotonPago: boolean = false;
  mostrarBotones() {
    //this.mostrarBotonPago = true;
    this.mostrarInformacionUsuario = false;
  }

  guardarPago(form: NgForm) {
    this._pagoService.guardarPago(this.pago).subscribe(
      (response) => {
        if (response.pago) {
          this.status = 'success';
          console.log(response.pago._id);
          form.reset();
          console.log(this.pago);
        } else {
          this.status = 'failed';
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }

  mostrarPagoT: boolean = false;
  mostrarPagoTotal() {
    this.mostrarPagoT = true;
  }


  //ASIENTOS

  toggleSeatState(seat: any) {
    seat.enabled = !seat.enabled;
    seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
    this.rows.forEach((row) => {
      row.seats.forEach((seat: any) => {
        seat.selected = false;
      });
    });
  }

  toggleRandom(): void {
    this.isRandomActive = !this.isRandomActive;

    if (!this.isRandomActive) {
      this.selectedCheckboxes = [];
      this.selected = 0;
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      });
      this.rows.forEach((row) => {
        row.seats.forEach((seat: any) => {
          seat.selected = false;
        });
      });
      this.emitArrayAsientos.emit(this.selectedCheckboxes);
      console.log(this.selectedCheckboxes);
      for (const row of this.rows) {
        for (const seat of row.seats) {
          if (seat.selected) {
            seat.enabled = !seat.enabled;
            seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
          }
        }
      }
    } 
    
    if (this.isRandomActive) {
      // Aquí puedes llamar a la función para seleccionar aleatoriamente los checkboxes
      this.selectedCheckboxes = [];
      this.selected = 0;
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      });
      this.rows.forEach((row) => {
        row.seats.forEach((seat: any) => {
          seat.selected = false;
        });
      });
      this.selectRandomCheckboxes();
      this.emitArrayAsientos.emit(this.selectedCheckboxes);
      console.log(this.selectedCheckboxes);
      for (const row of this.rows) {
        for (const seat of row.seats) {
          if (seat.selected) {
            seat.enabled = !seat.enabled;
            seat.imageSrc = seat.enabled ? this.habilitadoImageSrc : this.desHabilitadoImageSrc;
          }
        }
      }
    }
  }

  selectedCheckboxes: string[] = [];

  extractSelectedCheckboxes() {
    this.selectedCheckboxes = [];
    for (const row of this.rows) {
      for (const seat of row.seats) {
        if (seat.selected) {
          this.selectedCheckboxes.push(seat.id);
        }
      }
    }
  }

  handleCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const rowIdMatches = checkbox.id.match(/^(\d+)/);
    if (rowIdMatches) {
      const rowId = Number(rowIdMatches[1]) - 1;
      if (rowId >= 0 && rowId <= this.rows.length) {
        const row = this.rows[rowId].seats;
        const selectedSeat = row.find((seat: any) => seat.id === checkbox.id);
  
        if (selectedSeat) {
          selectedSeat.selected = checkbox.checked;
          this.extractSelectedCheckboxes();
        }
  
        if (checkbox.checked) {
          if (this.selectedCheckboxes.length <= this.maxSelectedCheckboxes) {
            this.selected++;
            if (this.selectedCheckboxes.length === this.maxSelectedCheckboxes) {
            }
          } else {
            checkbox.checked = false;
          }
        } else {
          this.selected--;
        }
      } else {
        console.log('Row ID fuera de límites:', rowId);
      }
    }
  }

  disableCheckboxes() {
    const checkboxes: NodeListOf<HTMLInputElement> = this.el.nativeElement.querySelectorAll(
      'input[type="checkbox"]'
    );

    checkboxes.forEach((checkbox) => {
      if (this.disabledCheckboxes.includes(checkbox.id)) {
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    });
  }

// Selecciona aleatoriamente 'count' checkboxes de la matriz de checkboxes disponibles
selectRandomCheckboxes() {
  const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not(:disabled)')) as HTMLInputElement[];
  const availableCheckboxes = checkboxes.filter((checkbox) => !this.selectedCheckboxes.includes(checkbox.id));
  let count = this.maxSelectedCheckboxes - this.selectedCheckboxes.length;

  while (count > 0 && availableCheckboxes.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCheckboxes.length);
    const randomCheckbox = availableCheckboxes.splice(randomIndex, 1)[0];
    randomCheckbox.checked = true;

    // Simular un evento 'change' en el checkbox seleccionado aleatoriamente
    const event = new Event('change', { bubbles: true });
    Object.defineProperty(event, 'target', { value: randomCheckbox, enumerable: true });

    this.handleCheckboxChange(event);

    count--;
  }
}

  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.emitArrayAsientos.emit(this.selectedCheckboxes);
    this.displayStyle = "none";
  }

}
