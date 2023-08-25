import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Vuelo } from "../models/vuelo";
import { Observable } from "rxjs";
import { Global } from "./global";

@Injectable()
export class VuelosService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    getVuelos():Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.get(this.url+'obtener-vuelos',{headers:headers});
    }
    guardarVuelo(vuelo:Vuelo):Observable<any>{
        let params=JSON.stringify(vuelo);
        let headers=new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.post(this.url+'guardar-vuelo', params, {headers:headers});
    }
    getVuelo(id:String):Observable<any>{
        let headers=new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.get(this.url+'obtener-vuelo'+id, {headers:headers});
    }
    getUltimoNumeroVuelo(): Observable<number> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.get<number>(this.url + 'ultimo-numero-vuelo', {headers: headers});
    }
}

