// ✅ app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './Components/layout/layout.component';
import { DashBoardComponent } from './Components/layout/Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Components/layout/Pages/usuario/usuario.component';
import { ProductoComponent } from './Components/layout/Pages/producto/producto.component';
import { VentaComponent } from './Components/layout/Pages/venta/venta.component';
import { HistorialVentaComponent } from './Components/layout/Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Components/layout/Pages/reporte/reporte.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'pages',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'usuarios', component: UsuarioComponent },
      { path: 'productos', component: ProductoComponent },
      { path: 'venta', component: VentaComponent },
      { path: 'historial_venta', component: HistorialVentaComponent },
      { path: 'reportes', component: ReporteComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
