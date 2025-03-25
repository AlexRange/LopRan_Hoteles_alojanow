import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ComentariosCalificaciones } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { ComentariosService } from '../../services/comentarios.service';
import { HotelesService } from '../../services/hoteles.service';

@Component({
  selector: 'app-hoteles-cliente',
  standalone: false,
  templateUrl: './hoteles-cliente.component.html',
  styleUrls: ['./hoteles-cliente.component.css']
})
export class HotelesClienteComponent implements OnInit {
  hoteles: any[] = [];
  hotelesFiltrados: any[] = [];
  filtroEstrellas: number = 0;
  nuevoComentario: ComentariosCalificaciones = { id_comentario: 0, id_usuario: 0, id_hotel: 0, comentario: '', calificacion: 0, fecha_comentario: '' };
  usuarioId: number | null = null;
  mostrarModal: boolean = false;

  @ViewChild('comentarioModal', { static: false }) comentarioModal!: ElementRef;

  constructor(private hotelService: HotelesService, private comentariosService: ComentariosService, private authService: Auth) {}

  ngOnInit(): void {
    this.obtenerHoteles();
    this.authService.getCurrentUser().subscribe(user => {
      if (user) this.usuarioId = user.id_usuario;
    });
  }

  obtenerHoteles(): void {
    this.hotelService.getHotel().subscribe(
      (data) => {
        this.hoteles = data;
        this.hotelesFiltrados = data;
      },
      (error) => {
        console.error('Error al obtener los hoteles', error);
      }
    );
  }

  abrirModal(id_hotel: number | null): void {
    if (id_hotel) this.nuevoComentario.id_hotel = id_hotel;
    this.nuevoComentario.comentario = '';
    this.nuevoComentario.calificacion = 0;
    this.mostrarModal = true;  // Hacemos visible el modal
  }

  cerrarModal(): void {
    this.mostrarModal = false;  // Hacemos invisible el modal
  }

  seleccionarCalificacion(estrellas: number): void {
    this.nuevoComentario.calificacion = estrellas;
  }

  guardarComentario(): void {
    if (!this.usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }
  
    if (!this.nuevoComentario.comentario || !this.nuevoComentario.comentario.length
      && this.nuevoComentario.calificacion === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debe escribir un comentario y seleccionar una calificación',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'small-toast'
        }
      });
      return;
    }
  
    if (!this.nuevoComentario.comentario || !this.nuevoComentario.comentario.length) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debe escribir un comentario',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'small-toast'
        }
      });
      return;
    }
  
    if (this.nuevoComentario.calificacion === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debe seleccionar una calificación',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'small-toast'
        }
      });
      return;
    }
  
    this.nuevoComentario.id_usuario = this.usuarioId;
    this.nuevoComentario.fecha_comentario = new Date().toISOString();
  
    this.comentariosService.saveComentario(this.nuevoComentario).subscribe(
      response => {
        console.log('Comentario guardado:', response);
  
        // Mostrar la notificación de éxito
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Comentario guardado',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'small-toast'
          }
        });
  
        // Cerrar el modal inmediatamente después de guardar el comentario
        this.cerrarModal();
      },
      error => {
        console.error('Error al guardar el comentario', error);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'No se pudo guardar',
          toast: true,
          showConfirmButton: false,
          timer: 3000,
          customClass: {
            popup: 'small-toast'
          }
        });
      }
    );
  }
}