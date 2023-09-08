import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
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
export class CrearVueloComponent implements OnInit {
  public horas: number[] = [];
  public titulo: string;
  public vuelo!: Vuelo;
  public vuelos: Vuelo[] = []; // Nuevo
  public url: string;
  public status: string;
  public contadorVuelos!: number;
  public pasajeros?: Pasajero[];
  
  constructor(private renderer: Renderer2, private el: ElementRef, private _vueloService: VuelosService) {
    for (let i = 1; i <= 24; i++) {
      this.horas.push(i);
      this.vuelo = new Vuelo('', 0, '', '', '', '', '', 1, '1', [], 65, '', 30, 'Confirmado', true);
      

    }
    this.titulo = "GUARDAR";
    this.url = Global.url;
    this.status = "";
    this.pasajeros = [];
  }

  /*
  ngOnInit() {
    this.cargarVuelos();
  }
  */
  ngOnInit() {
    this.cargarVuelos();
    
    if (this.vuelos && this.vuelos.length > 0) {
        const maxNumeroVuelo = Math.max(...this.vuelos.map(v => v.numeroVuelo || 0));
        this.contadorVuelos = maxNumeroVuelo + 1;
    } else {
        this.contadorVuelos = 1; 
    }
}

  cargarVuelos() {
    this._vueloService.getVuelos().subscribe(
      response => {
        this.vuelos = response.vuelos;
      },
      error => {
        console.error("Error al obtener los vuelos:", error);
      }
    );
  }

  public showSuccessAlert: boolean = false;

  /*
  guardarVuelo(form: NgForm) {
    this.incrementarContadorVuelos();

    this._vueloService.guardarVuelo(this.vuelo).subscribe(
      response => {
        if (response.vuelo) {
          this.status = 'success';
          this.showSuccessAlert = true;
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 6000); 
          this.cargarVuelos(); // Actualizar la lista de vuelos después de guardar uno nuevo
        } else {
          this.status = 'failed';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
*/
guardarVuelo(form: NgForm) {
  this.incrementarContadorVuelos();
  
  const vueloToSend = this.getCleanVuelo();
  
  if (!vueloToSend._id) {
    vueloToSend._id = ''; // Asegurarte de que _id no sea undefined.
  }
  // Si hay otros campos que podrían ser undefined, inicialízalos aquí.

  this._vueloService.guardarVuelo(vueloToSend as Vuelo).subscribe(
      response => {
          if (response.vuelo) {
              this.status = 'success';
              this.showSuccessAlert = true;
              setTimeout(() => {
                  this.showSuccessAlert = false;
              }, 6000); 
              this.cargarVuelos(); // Actualizar la lista de vuelos después de guardar uno nuevo
          } else {
              this.status = 'failed';
          }
      },
      error => {
          console.log(<any>error);
      }
  );
}

getCleanVuelo(): Partial<Vuelo> {
  const { pasajeros, ...rest } = this.vuelo;
  return rest;
}





  eliminarVuelo(id: string) {
    console.log("ID del vuelo a eliminar:", id);

    this._vueloService.eliminarVuelo(id).subscribe(
      response => {
        console.log("Vuelo eliminado con éxito", response);
        this.cargarVuelos(); // Actualizar la lista de vuelos después de eliminar uno
      },
      error => {
        console.error("Error al eliminar el vuelo:", error);
      }
    );
  }

  incrementarContadorVuelos() {
    this.contadorVuelos++;
  //  this.vuelo = new Vuelo('', this.contadorVuelos, '', '', '', '', '', 1, '1', [], 65, '', 30, '', true);
    this.vuelo.numeroVuelo = this.contadorVuelos;

  }
  confirmarEliminacion(vueloId: string) {
    const respuesta = window.confirm("¿Seguro que quieres eliminar el vuelo?");
    if (respuesta) {
      this.eliminarVuelo(vueloId);
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