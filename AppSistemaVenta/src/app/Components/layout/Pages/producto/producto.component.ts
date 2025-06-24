import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';


import Swal from 'sweetalert2';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
  CommonModule,
  ...SHARED_IMPORTS
],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'accion1', 'accion2'];
  dataListaProductos = new MatTableDataSource<Producto>([]);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtlidadService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  ngAfterViewInit(): void {
    this.dataListaProductos.paginator = this.paginacionTabla;
  }

  obtenerProductos(): void {
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaProductos.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
      },
      error: (e) => {}
    });
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLowerCase();
  }

  nuevoProducto(): void {
    this.dialog.open(ModalProductoComponent, { disableClose: true }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerProductos();
    });
  }

  editarProducto(producto: Producto): void {
    this.dialog.open(ModalProductoComponent, { disableClose: true, data: producto }).afterClosed().subscribe(resultado => {
      if (resultado === 'true') this.obtenerProductos();
    });
  }

  eliminarProducto(producto: Producto): void {
    Swal.fire({
      title: '¿Deseas eliminar el producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver'
    }).then(resultado => {
      if (resultado.isConfirmed) {
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta('Producto eliminado', 'Listo!');
              this.obtenerProductos();
            } else {
              this._utilidadServicio.mostrarAlerta('No se pudo eliminar el producto', 'Error');
            }
          },
          error: (e) => {}
        });
      }
    });
  }
}
