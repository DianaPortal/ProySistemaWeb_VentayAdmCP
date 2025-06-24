import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import Swal from 'sweetalert2';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { Producto } from '../../../../Interfaces/producto';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';
import { ProductoService } from '../../../../Services/producto.service';
import { VentaService } from '../../../../Services/venta.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';
import { Venta } from '../../../../Interfaces/venta';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule,
     ReactiveFormsModule,
      ...SHARED_IMPORTS],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = [];
  listaProductoFiltro: Producto[] = [];
  listaProductosParaVenta: DetalleVenta[] = [];

  formularioProductoVenta: FormGroup;
  productoSeleccionado!: Producto;
  totalPagar: number = 0;
  tipoDePagoPorDefecto: string = 'Efectivo';
  bloquearBotonRegistrar: boolean = false;

  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource<DetalleVenta>([]);

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtlidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista=data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }
      },
      error: (e) => {}
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductoFiltro = this.retornarProductoPorFiltro(value);
    });
  }

  ngOnInit(): void {}

  retornarProductoPorFiltro(busqueda: any): Producto[] {
    const valor = typeof busqueda === 'string' ? busqueda.toLowerCase() : busqueda?.nombre.toLowerCase();
    return this.listaProductos.filter(p => p.nombre.toLowerCase().includes(valor));
  }

  mostrarProducto(producto: Producto){
    return producto?.nombre;
  }

  productoParaVenta(event: any) {
    this.productoSeleccionado = event.option.value;
  }

  calcularTotal(): void {
  this.totalPagar = this.listaProductosParaVenta.reduce((sum, item) => {
    return sum + parseFloat(item.totalTexto);
  }, 0);
}
  agregarProductoParaVenta(): void {
  const _cantidad: number = this.formularioProductoVenta.value.cantidad;
  const _precio: number = parseFloat(this.productoSeleccionado.precio);
  const _total: number = _cantidad * _precio;

  this.listaProductosParaVenta.push({
    idProducto: this.productoSeleccionado.idProducto,
    descripcionProducto: this.productoSeleccionado.nombre,
    cantidad: _cantidad,
    precioTexto: _precio.toFixed(2),
    totalTexto: _total.toFixed(2)
  });

  this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  this.calcularTotal(); 

  this.formularioProductoVenta.patchValue({
    producto: '',
    cantidad: ''
  });
}


  eliminarProducto(detalle: DetalleVenta) {
  const index = this.listaProductosParaVenta.indexOf(detalle);
  if (index !== -1) {
    this.listaProductosParaVenta.splice(index, 1);
    this.datosDetalleVenta.data = this.listaProductosParaVenta;
    this.calcularTotal(); // ✅ recalcula correctamente
  }
}


  registrarVenta(): void {
    if (this.listaProductosParaVenta.length > 0) {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipoDePagoPorDefecto,
        totalTexto: this.totalPagar.toFixed(2),
        detalleVenta: this.listaProductosParaVenta
      };

      this._ventaServicio.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta.data = [];

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Número de Venta: ${response.value.numeroDocumento}`
            });
          } else {
            this._utilidadServicio.mostrarAlerta('No se pudo registrar la venta', 'Oops!');
          }
        },
        complete: () => this.bloquearBotonRegistrar = false,
        error: () => {}
      });
    }
  }
}
