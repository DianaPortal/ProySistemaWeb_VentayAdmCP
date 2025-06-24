import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CommonModule } from '@angular/common';

import moment from 'moment';
import * as XLSX from 'xlsx';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { Reporte } from '../../../../Interfaces/reporte';
import { VentaService } from '../../../../Services/venta.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';



export const MY_DATA_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...SHARED_IMPORTS],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }]
})
export class ReporteComponent implements OnInit, AfterViewInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource<Reporte>([]);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtlidadService
  ) {
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const hoy = moment().format('DD/MM/YYYY');
    const hace30Dias = moment().subtract(30, 'days').format('DD/MM/YYYY');
    this.buscarVentas(hace30Dias, hoy);
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas(fechaInicio?: string, fechaFin?: string): void {
    const _fi = fechaInicio || moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _ff = fechaFin || moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if (_fi === 'Invalid date' || _ff === 'Invalid date') {
      this._utilidadServicio.mostrarAlerta('Debes ingresar ambas fechas', 'Oops!');
      return;
    }

    this._ventaServicio.reporte(_fi, _ff).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
        }
      },
      error: (e) => {}
    });
  }

  exportarExcel(): void {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'Reporte_Ventas.xlsx');
  }
}
