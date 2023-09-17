import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable } from "rxjs";
import { Global } from "./global";
import { Pago } from "../models/pago";

@Injectable()
export class PagoService{
    public url:string;
    constructor(
        private _http:HttpClient
    ){
        this.url=Global.url;
    }
    guardarPago(pago:Pago):Observable<any>{
        let params=JSON.stringify(pago);
        let headers=new HttpHeaders().set('Content-Type', 'application/json');       
        return this._http.post(this.url+'guardar-pago', params, {headers:headers});
    }
}

