import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


import { Producto } from '../../../../Interfaces/producto';
import { CategoriaService } from '../../../../Services/categoria.service';
import { ProductoService } from '../../../../Services/producto.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';
import { Categoria } from '../../../../Interfaces/categoria';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';



@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ...SHARED_IMPORTS
  ],
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})

export class ModalProductoComponent {
  private modalActual = inject(MatDialogRef<ModalProductoComponent>);
  private datosProducto = inject<Producto>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private _categoriaServicio = inject(CategoriaService);
  private _productoServicio = inject(ProductoService);
  private _utilidadServicio = inject(UtlidadService);

  formularioProducto = this.fb.group({
    nombre: ['', Validators.required],
    idCategoria: ['', Validators.required],
    stock: ['', Validators.required],
    precio: ['', Validators.required],
    esActivo: ['1', Validators.required],
  });

  tituloAccion = 'Agregar';
  botonAccion = 'Guardar';
  listaCategorias: Categoria[] = [];

  constructor() {
    if (this.datosProducto != null) {
      this.tituloAccion = 'Editar';
      this.botonAccion = 'Actualizar';

      this.formularioProducto.patchValue({
        nombre: this.datosProducto.nombre,
        idCategoria: String(this.datosProducto.idCategoria),
        stock: String(this.datosProducto.stock),
        precio: this.datosProducto.precio,
        esActivo: this.datosProducto.esActivo.toString(),
      });
    }

    this._categoriaServicio.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategorias = data.value;
      },
      error: () => {}
    });
  }

  guardarEditar_Producto() {
    const _producto: Producto = {
      idProducto: this.datosProducto == null ? 0 : this.datosProducto.idProducto,
      nombre: this.formularioProducto.value.nombre!,
      idCategoria: Number(this.formularioProducto.value.idCategoria),
      descripcionCategoria: '',
      precio: this.formularioProducto.value.precio!,
      stock: Number(this.formularioProducto.value.stock!),
      esActivo: parseInt(this.formularioProducto.value.esActivo!)
    };

    const observador = this.datosProducto == null
      ? this._productoServicio.guardar(_producto)
      : this._productoServicio.editar(_producto);

    observador.subscribe({
      next: (data) => {
        if (data.status) {
          const mensaje = this.datosProducto == null
            ? 'El producto se ha agregado correctamente'
            : 'El producto fue editado correctamente';
          this._utilidadServicio.mostrarAlerta(mensaje, 'Éxito');
          this.modalActual.close('true');
        } else {
          this._utilidadServicio.mostrarAlerta('No se pudo procesar el producto', 'Error');
        }
      },
      error: () => {}
    });
  }
}
