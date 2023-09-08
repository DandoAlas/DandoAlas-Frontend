import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Vuelo } from '../models/vuelo';
import { Observable } from 'rxjs';
import { Global } from './global';

interface ParamsType {
  origen?: string;
  destino?: string;
  fechaSalida?: string;
}

@Injectable()
export class VuelosService {
  public url: string;
  constructor(private _http: HttpClient) {
    this.url = Global.url;
  }
  getVuelos(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener-vuelos', { headers: headers });
  }
  guardarVuelo(vuelo: Vuelo): Observable<any> {
    let params = JSON.stringify(vuelo);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'guardar-vuelo', params, {
      headers: headers,
    });
  }
  getVuelo(id: String): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'obtener-vuelo' + id, {
      headers: headers,
    });
  }
  getUltimoNumeroVuelo(): Observable<number> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get<number>(this.url + 'ultimo-numero-vuelo', {
      headers: headers,
    });
  }

  eliminarVuelo(id: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.url + 'eliminar-vuelo/' + id, {
      headers: headers,
    });
  }

  actualizarVuelo(vuelo: Vuelo) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.put(`${this.url}actualizar-vuelo/${vuelo._id}`, vuelo);
  }

  getVuelosConFiltros(
    origen: string,
    destino: string,
    fechaSalida: string
  ): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    let params = new HttpParams();
    if (origen) {
      params = params.set('origen', origen);
    }
    if (destino) {
      params = params.set('destino', destino);
    }
*/ kevinC7
    if (fechaSalida) {
      params = params.set('fechaSalida', fechaSalida);
 /*

    eliminarVuelo(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + 'eliminar-vuelo/' + id, { headers: headers });
    }

    
    getVuelosConFiltros(origen: string, destino: string, fechaSalida: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        let params = new HttpParams();
        if (origen) {
            params = params.set('origen', origen);
        }
        if (destino) {
            params = params.set('destino', destino);
        }
        if (fechaSalida) {
            params = params.set('fechaSalida', fechaSalida);
        }
        return this._http.get(this.url + 'buscar', { headers: headers, params: params });
// develop
    }
    return this._http.get(this.url + 'buscar', {
      headers: headers,
      params: params,
    });
  }
}
