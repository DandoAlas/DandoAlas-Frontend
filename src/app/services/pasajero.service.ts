import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Pasajero } from "../models/pasajero";
import { Observable } from "rxjs";
import { Global } from "./global";

@Injectable()
export class PasajeroService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    getPasajeros():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'obtener-pasajeros',{headers:headers});
    }
    guardarPasajero(pasajero:Pasajero):Observable<any>{
        let params=JSON.stringify(pasajero);
        let headers=new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.post(this.url+'guardar-pasajero', params, {headers:headers});
    }
    getPasajero(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.get(this.url+'obtener-pasajero'+id, {headers:headers});
    }
}

