import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SHARED_IMPORTS } from '../../Reutilizable/shared/shared.imports';

import { MenuService } from '../../Services/menu.service';
import { UtlidadService } from '../../Reutilizable/utlidad.service';
import { Menu } from '../../Interfaces/menu';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule, 
    RouterOutlet,
    ...SHARED_IMPORTS
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  private router = inject(Router);
  private menuService = inject(MenuService);
  private utilidadService = inject(UtlidadService);

  ngOnInit(): void {
    const usuario = this.utilidadService.obtenerSesionUsuario();

    if (usuario != null) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      console.log(this.correoUsuario, this.rolUsuario);

      this.menuService.lista(usuario.idUsuario).subscribe({
        next: (data) => {
          if (data.status) this.listaMenus = data.value;
          console.log('Menús cargados:', this.listaMenus); 
        },
        error: (e) => {
          console.error('Error al obtener menús', e);
        }
      });
    }
  }

  cerrarSesion() {
    this.utilidadService.eliminarSesionUsuario();
    this.router.navigate(['login']);
  }
}
