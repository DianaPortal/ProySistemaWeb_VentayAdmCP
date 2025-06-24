// Components/layout/layout-routing.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashBoardComponent } from './layout/Pages/dash-board/dash-board.component';
import { ProductoComponent } from './layout/Pages/producto/producto.component';
import { UsuarioComponent } from './layout/Pages/usuario/usuario.component';
import { HistorialVentaComponent } from './layout/Pages/historial-venta/historial-venta.component';
import { VentaComponent } from './layout/Pages/venta/venta.component';
import { ReporteComponent } from './layout/Pages/reporte/reporte.component';


export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'historialventa', component: HistorialVentaComponent },     
      { path: 'producto', component: ProductoComponent },
      { path: 'reporte', component: ReporteComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'venta', component: VentaComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
