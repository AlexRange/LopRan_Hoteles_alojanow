import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Usuarios } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { OtpService } from '../../services/otp.service';
import { RegistroComponent } from './registro/registro.component';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() datosUsuario: EventEmitter<Usuarios> = new EventEmitter<Usuarios>();
  email: string = '';
  contrasena: string = '';
  mostrarModalOtp: boolean = false;
  otp_code: string = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private modal: NgbModal,
    private otpService: OtpService
  ) { }

  login(): void {
    if (!this.email || !this.contrasena) {
      this.showError('Por favor ingrese email y contraseña');
      return;
    }

    this.authService.loginToServer(this.email, this.contrasena).subscribe({
      next: (response) => {
        if (response?.success) {
          this.mostrarModalOtp = true;
          this.enviarOtp();
        } else {
          this.showError(response?.message || 'Credenciales incorrectas');
        }
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.showError(err.error?.message || 'Error en el servidor. Intente nuevamente.');
      }
    });
  }

  enviarOtp(): void {
    this.otpService.sendOtp(this.email).subscribe({
      next: () => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Código enviado a tu correo',
          toast: true,
          showConfirmButton: false,
          timer: 3000
        });
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al enviar OTP',
          text: err.error?.message || 'Intente nuevamente',
          toast: true,
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }

  verificarOtp(): void {
    if (!this.otp_code) {
      this.showError('Por favor ingrese el código OTP');
      return;
    }

    this.otpService.verifyOtp(this.email, this.otp_code).subscribe({
      next: (response) => {
        if (response?.success) {
          this.authService.completeLogin();
          this.completarInicioSesion();
        } else {
          this.showError(response?.message || 'Código OTP inválido');
        }
      },
      error: (err) => {
        console.error('Error en verificación OTP:', err);
        this.showError(err.error?.message || 'Error al verificar OTP');
      }
    });
  }

  completarInicioSesion(): void {
    const user = this.authService.getCurrentUserValue();
    if (user?.tipo) {
      this.datosUsuario.emit(user);
      this.mostrarModalOtp = false;

      switch (user.tipo.toLowerCase()) {
        case 'admin':
          this.router.navigate(['/home-admin']);
          break;
        case 'cliente':
          this.router.navigate(['/home']);
          break;
        default:
          this.authService.logout().subscribe();
          this.showError('Tipo de usuario no válido');
      }
    } else {
      this.authService.logout().subscribe();
      this.showError('Error al obtener datos del usuario');
    }
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  }

  reenviarOtp(): void {
    this.enviarOtp();
  }

  cerrarModalOtp(): void {
    this.mostrarModalOtp = false;
    this.otp_code = '';
  }

  openModal(): void {
    this.modal.open(RegistroComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
    });
  }
}