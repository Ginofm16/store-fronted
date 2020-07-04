import { Producto } from './../_model/producto';
import { environment } from './../../environments/environment';
import { GenericService } from './generic.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{

  private productoCambio = new Subject<Producto[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/productos`
    )
  }

   //GET Subjects
   getProductoCambio(){
    return this.productoCambio.asObservable();
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }
  //SET 
  setPersonaCambio(productos : Producto[]){
    this.productoCambio.next(productos);
  }

  setMensajeCambio(mensaje : string){
    this.mensajeCambio.next(mensaje);
  }
}
