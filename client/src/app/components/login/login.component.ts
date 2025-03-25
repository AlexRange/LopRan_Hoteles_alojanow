import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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
  tempUserData: any;

  constructor(
    private authService: Auth,
    private router: Router,
    private modal: NgbModal,
    private otpService: OtpService
  ) {}

  login(): void {
    this.authService.loginToServer(this.email, this.contrasena).subscribe({
      next: (response: any) => {
        if (response && response.success && response.usuario) {
          // Solo guardamos temporalmente los datos del usuario
          this.tempUserData = response.usuario;
          this.mostrarModalOtp = true;
          this.enviarOtp();
        } else {
          this.showError(response?.message || 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        }
      },
      error: (err) => {
        this.showError('Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.');
        console.error('Login error:', err);
      },
    });
  }

  enviarOtp(): void {
    this.otpService.sendOtp(this.email).subscribe({
      next: (response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'El código ha sido enviado a tu correo electrónico',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'small-toast'
          }
        });
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No se pudo enviar el código al correo electrónico',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'small-toast'
          }
        });
      }
    });
  }

  verificarOtp(): void {
    this.otpService.verifyOtp(this.email, this.otp_code).subscribe({
      next: (response) => {
        if (response.success) {
          // SOLO AQUÍ establecemos al usuario como autenticado
          this.authService.setCurrentUser(this.tempUserData);
          this.authService.setLoggedInStatus(true);
          this.mostrarModalOtp = false;
          this.completarInicioSesion();
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            toast: true,
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          this.showError(response.message || 'Código OTP inválido');
        }
      },
      error: (err) => {
        this.showError(err.error.message || 'Error al verificar OTP');
      }
    });
  }

  completarInicioSesion(): void {
    this.authService.getCurrentUser().subscribe({
      next: (usuario: Usuarios | null) => {
        if (usuario && usuario.tipo) {
          this.datosUsuario.emit(usuario);
          
          switch(usuario.tipo.toLowerCase()) {
            case 'cliente':
              this.router.navigate(['/home']);
              break;
            case 'admin':
              this.router.navigate(['/home-admin']);
              break;
            default:
              this.showError('Tipo de usuario no reconocido: ' + usuario.tipo);
              this.authService.logout();
          }
        } else {
          this.showError('No se pudo obtener la información del usuario. Contacta al administrador.');
          this.authService.logout();
        }
      },
      error: (err) => {
        this.showError('Error al obtener información del usuario');
        this.authService.logout();
      }
    });
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
    this.tempUserData = null;
  }

  openModal() {
    this.modal.open(RegistroComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
    });
  }
}