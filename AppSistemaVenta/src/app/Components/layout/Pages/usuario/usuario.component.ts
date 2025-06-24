import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../Reutilizable/shared/shared.imports';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import Swal from 'sweetalert2';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario.service';
import { UtlidadService } from '../../../../Reutilizable/utlidad.service';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'accion1', 'accion2'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuariosServicio: UsuarioService,
    private _utilidadServicio: UtlidadService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  obtenerUsuarios() {
    this._usuariosServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataListaUsuarios.data = data.value;
        } else {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: () => { }
    });
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario() {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: Usuario) {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerUsuarios();
    });
  }

  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: '¿Deseas eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No. volver'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._usuariosServicio.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El usuario fue eliminado", "Listo!");
              this.obtenerUsuarios();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: () => { }
        });
      }
    });
  }
}
