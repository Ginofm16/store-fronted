import { environment } from './../../environments/environment';
import { Venta } from './../_model/venta';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VentaService extends GenericService<Venta>{

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/ventas`);
  }

  registrarVenta(venta : Venta){
    return this.http.post(this.url, venta);
  }
}
