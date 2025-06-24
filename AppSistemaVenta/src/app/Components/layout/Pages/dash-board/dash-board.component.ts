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
  const canvas = document.getElementById('chartBarras') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Crear un degradado de color
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(66, 165, 245, 0.8)');
  gradient.addColorStop(1, 'rgba(33, 150, 243, 0.4)');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labelGrafico,
      datasets: [{
        label: 'Ventas semanales',
        data: dataGrafico,
        backgroundColor: gradient,
        borderRadius: 10,
        borderSkipped: false
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeOutBounce'
      },
      plugins: {
        tooltip: {
          backgroundColor: '#333',
          titleColor: '#fff',
          bodyColor: '#ddd',
          padding: 10,
          cornerRadius: 8
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#444',
            font: {
              size: 13,
              weight: 'bold'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#e0e0e0'
          },
          ticks: {
            color: '#444',
            font: {
              size: 13
            }
          }
        }
      }
    }
  });
}
}
