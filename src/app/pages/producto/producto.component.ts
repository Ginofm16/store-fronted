import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductoService } from './../../_service/producto.service';
import { Producto } from './../../_model/producto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  displayedColumns = ['idProducto', 'nombre', 'marca', 'precio', 'acciones'];
  dataSource: MatTableDataSource<Producto>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productoService: ProductoService,
    private snackBar : MatSnackBar,
    public route: ActivatedRoute) { }

  ngOnInit(): void {

    this.productoService.getProductoCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.productoService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    })


      this.productoService.listar().subscribe(data => {
        console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  filtrar(valor: string){
    this.dataSource.filter = valor.trim().toLocaleLowerCase();
  }

  eliminar(idProducto: number){
    this.productoService.eliminar(idProducto).pipe(switchMap(() => {
      return this.productoService.listar();
    })).subscribe(data => {
        this.productoService.setPersonaCambio(data);
        this.productoService.setMensajeCambio('SE ELIMINO');
      })
  }

}
