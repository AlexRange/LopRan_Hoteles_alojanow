import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuarios } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-perfil',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, height: 0 }))
      ])
    ])
  ],
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuarios;
  editForm: FormGroup;
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      contrasena: ['', [this.passwordValidator()]],
      confirmarContrasena: [''],
      imagen_usuario: ['']
    }, {
      validators: this.matchPasswords
    });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupUserSubscription();
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.isLoading = true;
      this.usuariosService.getUsuario(currentUser.id_usuario).subscribe({
        next: (user) => {
          this.usuario = user;
          this.resetEditForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
          this.handleNoUser();
        }
      });
    } else {
      this.handleNoUser();
    }
  }

  private setupUserSubscription(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuario = { ...user };
        if (!this.isEditing) {
          this.resetEditForm();
        }
      }
    });
  }

  private resetEditForm(): void {
    this.editForm.patchValue({
      telefono: this.usuario.telefono || '', // Usa cadena vacía si es null/undefined
      imagen_usuario: this.usuario.imagen_usuario || '',
      contrasena: '',
      confirmarContrasena: ''
    });
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || value.length === 0) {
        return null; // No validar si está vacío (no es obligatorio cambiar la contraseña)
      }

      const errors: any = {};
      if (value.length < 8) {
        errors.minlength = { requiredLength: 8, actualLength: value.length };
      }
      if (!/[A-Z]/.test(value)) {
        errors.missingUpperCase = true;
      }
      if (!/[a-z]/.test(value)) {
        errors.missingLowerCase = true;
      }
      if (!/[0-9]/.test(value)) {
        errors.missingNumber = true;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.missingSpecialChar = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('contrasena')?.value;
    const confirmPassword = group.get('confirmarContrasena')?.value;

    // Solo validar si se está cambiando la contraseña
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { passwordsMismatch: true };
    }
    return null;
  }

  campoNoValido(campo: string) {
    const control = this.editForm.get(campo);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  private handleNoUser(): void {
    Swal.fire('Error', 'No se encontró información del usuario', 'error');
    this.isLoading = false;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.resetEditForm();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.editForm.patchValue({
        imagen_usuario: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  }

  guardarCambios(): void {
    if (this.isSaving || this.editForm.invalid) return;
    this.isSaving = true;
  
    const formValue = this.editForm.value;
    const updateData: Partial<Usuarios> = {};
  
    if (formValue.telefono !== this.usuario.telefono) {
      updateData.telefono = formValue.telefono;
    }
  
    if (formValue.imagen_usuario !== this.usuario.imagen_usuario) {
      updateData.imagen_usuario = formValue.imagen_usuario;
    }
  
    if (formValue.contrasena?.trim()) {
      updateData.contrasena = formValue.contrasena;
    }
  
    if (Object.keys(updateData).length === 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      Toast.fire({
        icon: 'info',
        title: 'No hay cambios para guardar'
      });
      
      this.isSaving = false;
      return;
    }
  
    this.authService.updateUser(updateData).subscribe({
      next: (updatedUser: Usuarios) => {
        // Actualizar el usuario local con los datos combinados
        this.usuario = {
          ...this.usuario,
          ...updatedUser,
          telefono: updatedUser.telefono !== undefined ? updatedUser.telefono : this.usuario.telefono
        };
  
        this.resetEditForm();
  
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Datos actualizados correctamente'
        });

        this.loadUserData();
        // Cerrar la edición suavemente después de un breve retraso
        setTimeout(() => {
          this.isEditing = false;
          this.isSaving = false;
        }, 500);
      },
      error: (error: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'error',
          title: 'Error al actualizar la información'
        });
        this.isSaving = false;
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Has cerrado sesión correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home']);
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Se cerró la sesión localmente',
              icon: 'info',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home']);
            });
          }
        });
      }
    });
  }

  getHomeRoute(): string {
    return this.usuario?.tipo === 'admin' ? '/home-admin' : '/home';
}
}