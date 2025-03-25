import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Usuarios } from '../../../models/modelos';
import { CaptchaService } from '../../../services/captcha.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  siteKey: string = '6LeHj9oqAAAAAG49-Z2cpiQs9pnnx8iiISQ6kkXz';
  registroForm: FormGroup;
  imagenUserBase64: string = '';
  captchaToken: string | null = null;

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
      confirmarContrasena: ['', Validators.required],  // Agregar el campo confirmarContrasena
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      imagen_usuario: ['', Validators.required],
      fecha_registro: [new Date().toISOString()],
      tipo: ['cliente', Validators.required],
      estatus: 'Activo',
      recaptcha: ['', Validators.required],
    },
    {
      validators: this.matchPasswords,  // Aplicar validación al formulario completo
    });
  }

  ngOnInit(): void { }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const errors: any = {};
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
    // Validación del reCAPTCHA
    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, resuelve el reCAPTCHA antes de continuar.',
      });
      return;
    }
  
    // Validación del formulario
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
          return;
        }
  
        // Eliminar el campo confirmarContrasena del formulario
        this.registroForm.removeControl('confirmarContrasena');
        this.registroForm.removeControl('recaptcha');

        // Preparar el objeto del usuario
        const usuario: Usuarios = {
          id_usuario: 0, // O el valor que necesites para un nuevo usuario
          ...this.registroForm.value,
          imagen_usuario: this.imagenUserBase64 || null,
          estatus: true, // o true según tu lógica
        };
  
        // Enviar el código de verificación al email del usuario
        this.usuariosService.enviarCodigo(usuario.email).subscribe(
          () => {
            // Solicitar al usuario que ingrese el código recibido
            Swal.fire({
              title: 'Verificación de Código',
              input: 'text',
              inputLabel: 'Ingresa el código de verificación enviado a tu correo',
              inputPlaceholder: 'Código de verificación',
              showCancelButton: true,
              confirmButtonText: 'Verificar',
              cancelButtonText: 'Cancelar',
              inputValidator: (value) => {
                if (!value) {
                  return 'Debes ingresar un código de verificación';
                }
                return null;
              },
            }).then((result) => {
              if (!result.value) {
                Swal.fire({
                  icon: 'info',
                  title: 'Proceso cancelado',
                  text: 'No se completó el registro.',
                });
                return;
              }
  
              const codigo = result.value.trim();
  
              // Verificar el código ingresado con el backend
              this.usuariosService.verificarCodigo(usuario.email, codigo).subscribe(
                (verificacionResponse) => {
                  if (verificacionResponse?.success) {
                    // Código correcto, crear el usuario
                    this.usuariosService.createUsuario(usuario).subscribe({
                      next: () => {
                        Swal.fire({
                          icon: 'success',
                          title: 'Usuario registrado',
                          text: 'El usuario ha sido registrado exitosamente.',
                        });
                        this.modal.close(); // Cierra el modal de registro
                        this.registroForm.reset(); // Limpia el formulario si es necesario
                        this.captchaToken = null; // Resetea el token del captcha
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
                  } else {
                    // Código incorrecto o ya usado
                    Swal.fire({
                      icon: 'error',
                      title: 'Código incorrecto',
                      text: 'El código de verificación es incorrecto o ha expirado.',
                    });
                  }
                },
                (error) => {
                  console.error('Error en la verificación del código:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema al verificar el código. Inténtalo nuevamente.',
                  });
                }
              );
            });
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

  close() {
    this.modal.dismiss();
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

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          this.imagenUserBase64 = reader.result as string;
          this.registroForm.patchValue({ imagen_usuario: this.imagenUserBase64 });
        }
      };

      reader.onerror = () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al leer la imagen. Intenta con otro archivo.',
        });
        console.error('Error al leer el archivo:', reader.error);
      };

      reader.readAsDataURL(file);
    }
  }

  captchaResolved(token: string) {
    this.captchaToken = token;
    console.log('Token reCAPTCHA obtenido:', this.captchaToken);
  }

  resetCaptcha() {
    this.captchaToken = null;
    console.log('reCAPTCHA reseteado');
  }
}