import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';
import { DashBoardService } from '../../../../Services/dash-board.service';


Chart.register(...registerables);

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, AfterViewInit {
  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";
  labelGrafico: string[] = [];
  dataGrafico: number[] = [];

  constructor(private _dashboardServicio: DashBoardService) { }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayData: any[]  = data.value.ventasUltimaSemana;
         if (arrayData && arrayData.length > 0) {
            this.labelGrafico = arrayData.map((value) => value.fecha);
            this.dataGrafico = arrayData.map((value) => value.total);

            // Si los datos están disponibles, crear el gráfico
            this.mostrarGrafico(this.labelGrafico, this.dataGrafico);
          } else {
            console.error("No hay datos disponibles para 'ventasUltimaSemana'.");
          }
        }
      },
      error: (e) => {
        console.error("Error al obtener el resumen del dashboard:", e);
      }
    });
  }

  ngAfterViewInit(): void {}

  mostrarGrafico(labelGrafico: string[], dataGrafico: number[]) {
    new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
