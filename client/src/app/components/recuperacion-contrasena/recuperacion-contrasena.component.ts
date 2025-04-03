import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuariosService } from './../../services/usuarios.service';

@Component({
  selector: 'app-recuperacion-contrasena',
  standalone: false,
  templateUrl: './recuperacion-contrasena.component.html',
  styleUrl: './recuperacion-contrasena.component.css'
})
export class RecuperacionContrasenaComponent {
  emailForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async requestPasswordReset() {
    if (this.emailForm.invalid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor ingresa un correo electrónico válido',
        icon: 'error',
        confirmButtonText: 'Entendido',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    this.loading = true;
    const email = this.emailForm.get('email')?.value;

    try {
      const response = await this.usuariosService.enviarContrasena(email).toPromise();

      await Swal.fire({
        title: '¡Nueva contraseña enviada!',
        html: `Hemos enviado una nueva contraseña a <strong>${email}</strong>. 
                   Por favor revisa tu bandeja de entrada.`,
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      this.router.navigate(['/login']);
    } catch (error: unknown) {
      console.error('Error en requestPasswordReset:', error);

      let errorMessage = 'No pudimos enviar la contraseña. Verifica tu correo electrónico e intenta nuevamente.';

      if (error instanceof Error && 'error' in error && typeof error.error === 'object' && error.error !== null) {
        const err = error.error as { message?: string };
        if (err.message) {
          errorMessage = err.message;
        }
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}