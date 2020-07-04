import { environment } from './../../environments/environment';
import { Persona } from './../_model/persona';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService extends GenericService<Persona>{

  private personaCambio = new Subject<Persona[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/personas`
    )
   }

   //GET Subjects
  getPersonaCambio(){
    return this.personaCambio.asObservable();
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }
  //SET 
  setPersonaCambio(personas : Persona[]){
    this.personaCambio.next(personas);
  }

  setMensajeCambio(mensaje : string){
    this.mensajeCambio.next(mensaje);
  }
}
