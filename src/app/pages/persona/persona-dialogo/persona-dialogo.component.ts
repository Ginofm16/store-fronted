import { PersonaService } from './../../../_service/persona.service';
import { Persona } from './../../../_model/persona';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-persona-dialogo',
  templateUrl: './persona-dialogo.component.html',
  styleUrls: ['./persona-dialogo.component.css']
})
export class PersonaDialogoComponent implements OnInit {

  persona : Persona;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : Persona,
  private dialogRef : MatDialogRef<PersonaDialogoComponent>,
  private personaService : PersonaService
  ) { }

  ngOnInit(): void {
    this.persona = new Persona();
    this.persona.idPersona = this.data.idPersona;
    this.persona.nombres = this.data.nombres;
    this.persona.apellidos = this.data.apellidos;

  }

  operar(){
    if (this.persona != null && this.persona.idPersona > 0) {

      this.personaService.modificar(this.persona).pipe(switchMap(() => {
        return this.personaService.listar();
        //al ser el return listar(), la ultima acciones del flujo nos podemos subscribir
      })).subscribe(data => {
        this.personaService.setPersonaCambio(data);
        this.personaService.setMensajeCambio('SE MODIFICO');
      });

    }else{
      this.personaService.registrar(this.persona).pipe(switchMap(() => {
        return this.personaService.listar();
      })).subscribe(data => {
        this.personaService.setPersonaCambio(data);
        this.personaService.setMensajeCambio('SE REGISTRO');
      });

    }
    this.cancelar();

  }

  cancelar(){
    this.dialogRef.close();
  }

}
