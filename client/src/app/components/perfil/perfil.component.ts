import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuarios } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuarios;
  editUsuario: Partial<Usuarios> = {};
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;

  constructor(
    private authService: Auth,
    private usuariosService: UsuariosService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.setupUserSubscription();
  }

  private loadUserData(): void {
    const user = this.authService.getCurrentUserValue();
    if (user) {
      this.usuario = { ...user };
      this.resetEditForm();
      this.isLoading = false;
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
    this.editUsuario = {
      telefono: this.usuario.telefono,
      imagen_usuario: this.usuario.imagen_usuario,
      contrasena: ''
    };
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
      this.editUsuario.imagen_usuario = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  guardarCambios(): void {
    if (this.isSaving) return;
    this.isSaving = true;
  
    // Preparar datos para actualización
    const updateData: Partial<Usuarios> = {};
  
    // Solo incluir campos que han cambiado
    if (this.editUsuario.telefono !== this.usuario.telefono) {
      updateData.telefono = this.editUsuario.telefono;
    }
  
    if (this.editUsuario.imagen_usuario !== this.usuario.imagen_usuario) {
      updateData.imagen_usuario = this.editUsuario.imagen_usuario;
    }
  
    if (this.editUsuario.contrasena?.trim()) {
      updateData.contrasena = this.editUsuario.contrasena;
    }
  
    // Verificar si hay algo que actualizar
    if (Object.keys(updateData).length === 0) {
      Swal.fire('Info', 'No hay cambios para guardar', 'info');
      this.isSaving = false;
      return;
    }
  
    this.authService.updateUser(updateData).subscribe({
      next: (updatedUser: Usuarios) => {
        // Actualizar el usuario local con los nuevos datos
        this.usuario = { ...this.usuario, ...updatedUser };
        this.resetEditForm();
        
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Tus datos se han actualizado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        this.isEditing = false;
        this.isSaving = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'No se pudo actualizar la información', 'error');
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
        this.authService.logout();
        this.router.navigate(['/home']); // Redirige a la página de inicio
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
}