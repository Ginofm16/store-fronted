import { Producto } from './../../../_model/producto';
import { ProductoService } from './../../../_service/producto.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-producto-edicion',
  templateUrl: './producto-edicion.component.html',
  styleUrls: ['./producto-edicion.component.css']
})
export class ProductoEdicionComponent implements OnInit {

  form : FormGroup;
  id: number;
  edicion: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private productoService : ProductoService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombre' : new FormControl(''),
      'marca' : new FormControl(''),
      'precio' : new FormControl('')
    });

    this.route.params.subscribe((data : Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    })
  }

  initForm(){
    if(this.edicion){
      this.productoService.listarPorId(this.id).subscribe( data => {
        this.form = new FormGroup({
          'id' : new FormControl(data.idProducto),
          'nombre' : new FormControl(data.nombre),
          'marca' : new FormControl(data.marca),
          'precio' : new FormControl(data.precio)
        });
      })
    }
  }

  operar(){
    let producto = new Producto();
    producto.idProducto = this.form.value['id'];
    producto.nombre = this.form.value['nombre'];
    producto.marca = this.form.value['marca'];
    producto.precio = this.form.value['precio'];

    if(this.edicion){
      this.productoService.modificar(producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setPersonaCambio(data);
        this.productoService.setMensajeCambio('SE MODIFICO');
      });
    }else {
      //insertar
      this.productoService.registrar(producto).pipe(switchMap(() => {
        return this.productoService.listar();
      })).subscribe(data => {
        this.productoService.setPersonaCambio(data);
        this.productoService.setMensajeCambio('SE REGISTRO');
      });
    }
    this.router.navigate(['producto']);
  }
}
