// ✅ app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { layoutRoutes } from './Components/layout-routing';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    loadChildren: () =>
      import('./Components/layout-routing').then((m) => m.layoutRoutes)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

