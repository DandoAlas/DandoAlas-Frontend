import { Injectable } from "@angular/core";
import { Global } from "./global";
@Injectable()
export class CargarService{
    public url:string;
    constructor(){
        this.url=Global.url;
    }
    peticionRequest(url:string, params:Array<string>, name:string){
        return new Promise(function(resolve,reject){
            var formData:any=new FormData();
            var xhr=new XMLHttpRequest();
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}