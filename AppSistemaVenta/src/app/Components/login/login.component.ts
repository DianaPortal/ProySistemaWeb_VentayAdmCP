import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SHARED_IMPORTS } from '../../Reutilizable/shared/shared.imports';
import { UsuarioService } from '../../Services/usuario.service';
import { UtlidadService } from '../../Reutilizable/utlidad.service';
import { Login } from '../../Interfaces/login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...SHARED_IMPORTS],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtlidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  iniciarSesion(): void {
    if (this.formularioLogin.invalid) return;

    this.mostrarLoading = true;

    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };

  this._usuarioServicio.IniciarSesion(request).subscribe({
  next: (data) => {
    if (data.status) {
      
      this._utilidadServicio.guardarSesionUsuario(data.value);

      
      Swal.fire({
    icon: 'success',
    title: 'Bienvenido',
    text: `${data.value.nombreCompleto} 👋`,
    confirmButtonText: 'Continuar',
    allowOutsideClick: false,  
    allowEscapeKey: false,      
    backdrop: false,           
    didOpen: () => {
      // Opcionalmente puedes enfocar el botón
    const btn = Swal.getConfirmButton();
    if (btn) btn.focus();
  }
}).then(() => {
  // ✅ Solo navegamos cuando el usuario da "Continuar"
  this.router.navigate(['pages']);
});
    } else {
      
      this._utilidadServicio.mostrarAlerta("El usuario y/o contraseña son incorrectos", "¡Ups!");
    }
  },
  error: () => {
    
    this._utilidadServicio.mostrarAlerta("Hubo un error al iniciar sesión", "¡Ups!");
  },
  complete: () => {
    this.mostrarLoading = false;
  }
});

  }
}
