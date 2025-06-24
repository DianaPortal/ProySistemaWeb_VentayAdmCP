import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';


@Component({
  selector: 'app-modal-detalle-venta',
  standalone: true,
  imports: [
    CommonModule,
    ...SHARED_IMPORTS
    ],
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent {
  private _venta = inject<Venta>(MAT_DIALOG_DATA);

  fechaRegistro: string = this._venta.fechaRegistro!;
  numeroDocumento: string = this._venta.numeroDocumento!;
  tipoPago: string = this._venta.tipoPago;
  total: string = this._venta.totalTexto;
  detalleVenta: DetalleVenta[] = this._venta.detalleVenta;

  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];
}