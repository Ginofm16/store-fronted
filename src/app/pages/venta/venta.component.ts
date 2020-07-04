import { VentaService } from './../../_service/venta.service';
import { Persona } from './../../_model/persona';
import { Venta } from './../../_model/venta';
import { DetalleVenta } from './../../_model/detalleVenta';
import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { PersonaService } from './../../_service/persona.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  displayedColumns = ['producto', 'precio', 'cantidad', 'total', 'eliminar'];
  dataSource: MatTableDataSource<any>;

  personas$: Observable<Persona[]>;
  productos$: Observable<Producto[]>;

  idPersonaSeleccianda: number;
  idProductoSeleccionado: number;
  cantidad: number;
  total: number;

  lstDetalleVenta2: DetalleVenta[] = [];
  lstDetalleVenta: DetalleVenta[];

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  constructor(private personaService: PersonaService,
    private productoService: ProductoService,
    private ventaService : VentaService,
    private snackBar : MatSnackBar
 ) { }

  ngOnInit(): void {
    this.listarPacientes$();
    this.listarProductos$();

  }

  listarPacientes$() {
    //EMPTY define una variable observable vacia
    //this.pacientes$ = EMPTY;
    this.personas$ = this.personaService.listar();
  }

  listarProductos$() {
    //EMPTY define una variable observable vacia
    //this.pacientes$ = EMPTY;
    this.productos$ = this.productoService.listar();
  }

  costo: number;
  jsonArray: any;
  agregar() {
    let producto = new Producto();
    let dVenta = new DetalleVenta();


    this.productoService.listarPorId(this.idProductoSeleccionado).subscribe(p => {

      if (this.existeItem(this.idProductoSeleccionado)) {
        console.log('if existeITem');
        this.incrementaCantidad(this.idProductoSeleccionado, this.cantidad);

        let jsonArray = JSON.parse(JSON.stringify(this.lstDetalleVenta2));
        console.log(jsonArray);
        this.dataSource = new MatTableDataSource(jsonArray);
        
      } else {
      console.log('else');
        producto.idProducto = this.idProductoSeleccionado;
        producto.nombre = p.nombre;
        producto.precio = p.precio;
        dVenta.producto = producto;
        dVenta.cantidad = this.cantidad;

        this.lstDetalleVenta2.push(dVenta);

        let jsonArray = JSON.parse(JSON.stringify(this.lstDetalleVenta2));

        this.dataSource = new MatTableDataSource(jsonArray);
        console.log(this.dataSource);

      }
    });
  }

  existeItem(id: number): boolean {
    console.log('existeItem')
    let existe = false;
    this.lstDetalleVenta2.forEach(d => {
      if (d.producto.idProducto === this.idProductoSeleccionado) {
        console.log('si existe')
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number, cant : number): void {
     this.lstDetalleVenta2.map((m: DetalleVenta) => {
      console.log('incrementoCantidad '+ m.producto.nombre);
      if (id === m.producto.idProducto) {
        console.log('incrementoCantidad '+ m.producto.nombre + m.cantidad + cant);
        m.cantidad = m.cantidad + cant;
      }
      return m;
    });

  }

  eliminar(id: number): void {
    this.lstDetalleVenta2 = this.lstDetalleVenta2.filter((item: DetalleVenta) =>
      id !== item.producto.idProducto);

      let jsonArray = JSON.parse(JSON.stringify(this.lstDetalleVenta2));
        console.log(jsonArray);
        this.dataSource = new MatTableDataSource(jsonArray);
  }



  aceptar(){
    let costoTotal=0;

    let persona = new Persona();
    persona.idPersona = this.idPersonaSeleccianda;
    console.log('persona' + persona);
    let venta = new Venta()
    venta.persona = persona;
    venta.fecha = moment().format('YYYY-MM-DDTHH:mm:ss');
    this.lstDetalleVenta2.forEach( dv => {
      costoTotal = costoTotal + (dv.producto.precio * dv.cantidad);
      
    })
    
    venta.importe = costoTotal;
    venta.detalleVenta = this.lstDetalleVenta2;
    this.ventaService.registrar(venta).subscribe( () => {
      this.snackBar.open("Se registro", "Aviso", {duration: 2000});

      setTimeout( () => {
        this.limpiarControles();
      }, 2000)
      
    });

  }

  limpiarControles() {
    this.lstDetalleVenta2 = [];
    let jsonArray = JSON.parse(JSON.stringify(this.lstDetalleVenta2));
    console.log(jsonArray);
    this.dataSource = new MatTableDataSource(jsonArray);
    
    this.idPersonaSeleccianda = 0;
    this.idProductoSeleccionado = 0;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.cantidad = 0;
  }


}
