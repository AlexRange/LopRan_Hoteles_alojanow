import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Usuarios } from '../../../models/modelos';
import { CaptchaService } from '../../../services/captcha.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnDestroy {
  siteKey: string = '6LeHj9oqAAAAAG49-Z2cpiQs9pnnx8iiISQ6kkXz';
  registroForm: FormGroup;
  imagenFileName: string = '';
  captchaToken: string | null = null;
  captchaExpired = false;
  private captchaRefreshTimer?: Subscription;
  private verificationTimer?: Subscription;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private modal: NgbActiveModal,
    private captchaService: CaptchaService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(8), this.passwordValidator()]],
      confirmarContrasena: ['', Validators.required],
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      imagen_usuario: ['', Validators.required],
      fecha_registro: [new Date().toISOString()],
      tipo: ['cliente', Validators.required],
      estatus: [1],
      token: [null],
      recaptcha: ['', Validators.required],
    }, {
      validators: this.matchPasswords,
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.captchaRefreshTimer) {
      this.captchaRefreshTimer.unsubscribe();
    }
    if (this.verificationTimer) {
      this.verificationTimer.unsubscribe();
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const errors: any = {};
      if (!value || value.length < 8) {
        errors.missingUpperCase = 'Debe contener al menos 8 caracteres de longitud';
        return null;
      }
      if (!/[A-Z]/.test(value)) {
        errors.missingUpperCase = 'Debe contener al menos una letra mayúscula';
      }
      if (!/[a-z]/.test(value)) {
        errors.missingLowerCase = 'Debe contener al menos una letra minúscula';
      }
      if (!/[0-9]/.test(value)) {
        errors.missingNumber = 'Debe contener al menos un número';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.missingSpecialChar = 'Debe contener al menos un carácter especial';
      }
      if (Object.keys(errors).length > 0) {
        return errors;
      }
      return null;
    };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  campoNoValido(campo: string) {
    return this.registroForm.get(campo)?.invalid && this.registroForm.get(campo)?.touched;
  }

  onSubmit() {
    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, resuelve el reCAPTCHA antes de continuar.',
      });
      return;
    }

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor, completa todos los campos requeridos.',
      });
      return;
    }

    // Verificar el token del reCAPTCHA con el backend
    this.captchaService.verifyRecaptcha(this.captchaToken).subscribe(
      (response) => {
        if (!response?.success) {
          Swal.fire({
            icon: 'error',
            title: 'Error de verificación',
            text: 'La verificación de reCAPTCHA ha fallado. Inténtalo de nuevo.',
          });
          this.resetCaptcha();
          return;
        }

        // Iniciar temporizador para refrescar el reCAPTCHA después de 2 minutos (tiempo de expiración)
        this.startCaptchaRefreshTimer();

        // Enviar el código de verificación al email del usuario
        this.usuariosService.enviarCodigo(this.registroForm.value.email).subscribe(
          () => {
            this.showVerificationDialog();
          },
          (error) => {
            console.error('Error al enviar el código:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al enviar el código de verificación. Inténtalo nuevamente.',
            });
          }
        );
      },
      (error) => {
        console.error('Error en la verificación de reCAPTCHA:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'Hubo un problema durante la verificación del reCAPTCHA. Inténtalo nuevamente.',
        });
      }
    );
  }

  private startCaptchaRefreshTimer() {
    // Limpiar temporizador anterior si existe
    if (this.captchaRefreshTimer) {
      this.captchaRefreshTimer.unsubscribe();
    }

    // Configurar nuevo temporizador para 2 minutos (120000 ms)
    this.captchaRefreshTimer = timer(120000).subscribe(() => {
      this.captchaExpired = true;
      this.resetCaptcha();
      Swal.fire({
        icon: 'info',
        title: 'reCAPTCHA expirado',
        text: 'El reCAPTCHA ha expirado. Por favor, resuélvelo nuevamente.',
        timer: 5000,
        showConfirmButton: false
      });
    });
  }

  private showVerificationDialog() {
    Swal.fire({
      title: 'Verificación de Código',
      html: `
        <p>Hemos enviado un código de verificación a tu correo electrónico.</p>
        <p>Si no lo recibes, puedes solicitar uno nuevo.</p>
        <input type="text" id="verificationCode" class="swal2-input" placeholder="Código de verificación">
        <small id="timerText" style="display: block; margin-top: 10px;">El código expirará en 5:00</small>
      `,
      showCancelButton: true,
      confirmButtonText: 'Verificar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      didOpen: () => {
        const timerText = document.getElementById('timerText');
        let timeLeft = 300; // 5 minutos en segundos

        // Actualizar el temporizador cada segundo
        this.verificationTimer = timer(0, 1000).subscribe(() => {
          if (timeLeft > 0) {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            if (timerText) {
              timerText.textContent = `El código expirará en ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
          } else {
            // Tiempo agotado
            if (this.verificationTimer) {
              this.verificationTimer.unsubscribe();
            }
            Swal.fire({
              icon: 'error',
              title: 'Tiempo agotado',
              text: 'El código de verificación ha expirado. Por favor, solicita uno nuevo.',
              confirmButtonText: 'OK'
            }).then(() => {
              this.onSubmit(); // Volver a enviar el formulario
            });
          }
        });
      },
      preConfirm: () => {
        const inputElement = document.getElementById('verificationCode') as HTMLInputElement;
        const codigo = inputElement?.value.trim();

        if (!codigo) {
          Swal.showValidationMessage('Debes ingresar un código de verificación');
          return null;
        }

        return codigo;
      }
    }).then((result) => {
      // Limpiar el temporizador cuando se cierra el diálogo
      if (this.verificationTimer) {
        this.verificationTimer.unsubscribe();
      }

      if (result.isConfirmed && result.value) {
        const codigo = result.value;
        this.verifyCodeAndRegister(codigo);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Proceso cancelado',
          text: 'No se completó el registro.',
        });
      }
    });
  }

  private verifyCodeAndRegister(codigo: string) {
    const email = this.registroForm.value.email;

    this.usuariosService.verificarCodigo(email, codigo).subscribe(
      (verificacionResponse) => {
        if (verificacionResponse?.success) {
          // Código correcto, proceder con el registro
          this.completeRegistration();
        } else {
          // Código incorrecto o ya usado
          Swal.fire({
            icon: 'error',
            title: 'Código incorrecto',
            text: 'El código de verificación es incorrecto o ha expirado.',
          }).then(() => {
            this.showVerificationDialog(); // Mostrar nuevamente el diálogo de verificación
          });
        }
      },
      (error) => {
        console.error('Error en la verificación del código:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al verificar el código. Inténtalo nuevamente.',
        }).then(() => {
          this.showVerificationDialog(); // Mostrar nuevamente el diálogo de verificación
        });
      }
    );
  }

  private completeRegistration() {
    // Clonar el formulario para no afectar el original
    const formData = { ...this.registroForm.value };
    delete formData.confirmarContrasena;
    delete formData.recaptcha;

    // Usar this.imagenFileName que ya contiene el nombre del archivo
    const usuario: Usuarios = {
      id_usuario: 0,
      ...formData,
      imagen_usuario: this.imagenFileName, // Usamos la variable que ya contiene el nombre
      estatus: true,
    };

    this.usuariosService.createUsuario(usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'El usuario ha sido registrado exitosamente.',
        });
        this.modal.close();
        this.registroForm.reset();
        this.captchaToken = null;
        this.clearTimers();
        this.imagenFileName = ''; // Limpiar también el nombre del archivo
      },
      error: (error) => {
        console.error('Error al registrar el usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el usuario. Inténtalo nuevamente.',
        });
      },
    });
  }

  close() {
    if (this.registroForm.dirty) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Los cambios no guardados se perderán',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#081b16',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.clearTimers();
          this.modal.dismiss();
        }
      });
    } else {
      this.clearTimers();
      this.modal.dismiss();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no válido',
          text: 'Por favor, selecciona una imagen en formato PNG o JPG.',
        });
        return;
      }

      this.usuariosService.uploadImage(file).subscribe({
        next: (response) => {
          // Asignar el nombre del archivo tanto al formulario como a la variable local
          this.imagenFileName = response.filename;
          this.registroForm.patchValue({
            imagen_usuario: response.filename
          });
        },
        error: (error) => {
          console.error('Error al subir la imagen:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al subir la imagen. Intenta con otro archivo.',
          });
        }
      });
    }
  }

  captchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaExpired = false;
  }

  resetCaptcha() {
    this.captchaToken = null;
    this.captchaExpired = true;
    this.registroForm.get('recaptcha')?.reset();

  }
}