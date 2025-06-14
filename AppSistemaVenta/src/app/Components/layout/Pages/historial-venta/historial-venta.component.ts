import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';

import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';


export const MY_DATA_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-historial-venta',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    { value: 'fecha', descripcion: 'Por fechas' },
    { value: 'numero', descripcion: 'Número venta' }
  ]
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  datosListaVenta = new MatTableDataSource<Venta>();

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtlidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(() => {
      this.formularioBusqueda.patchValue({ numero: '', fechaInicio: '', fechaFin: '' });
    });
  }

  ngOnInit(): void {
    this.obtenerHistorial('fecha', '', '01/01/2000', '01/01/2040');
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  obtenerHistorial(buscarPor: string, numero: string, fechaI: string, fechaF: string) {
    this._ventaServicio.historial(buscarPor, numero, fechaI, fechaF).subscribe({
      next: (data) => {
        if (data.status) {
          this.datosListaVenta.data = data.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => { }
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechaInicio = "";
    let _fechaFin = "";

    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._utilidadServicio.mostrarAlerta("Debes ingresar ambas fechas", "Oops!");
        return;
      }
    }

    this.obtenerHistorial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    );
  }

  verDetalleVenta(venta: Venta) {
    this.dialog.open(ModalDetalleVentaComponent, {
      data: venta,
      disableClose: true,
      width: '700px'
    });
  }
}
