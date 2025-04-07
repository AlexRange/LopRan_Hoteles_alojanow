import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ComentariosCalificaciones } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { ComentariosService } from '../../services/comentarios.service';
import { HotelesService } from '../../services/hoteles.service';
import { ReservacionesService } from '../../services/reservaciones.service'; // Importar el servicio de reservaciones

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
  hotelesReservados: number[] = []; // Almacenará los IDs de hoteles donde el usuario ha reservado
  showNavigationButtons = false;
  scrollThreshold = 200;
  showBottomButton = true;

  @ViewChild('comentarioModal', { static: false }) comentarioModal!: ElementRef;

  constructor(
    private hotelService: HotelesService,
    private comentariosService: ComentariosService,
    private authService: Auth,
    private reservacionesService: ReservacionesService // Inyectar el servicio
  ) { }

  ngOnInit(): void {
    this.obtenerHoteles();
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuarioId = user.id_usuario;
        this.obtenerReservacionesUsuario(user.id_usuario);
      }
    });
    this.checkScrollPosition();
  }

  obtenerReservacionesUsuario(idUsuario: number): void {
    this.reservacionesService.getReservacionesByIdUsuario(idUsuario).subscribe(
      (reservaciones) => {
        // Extraer IDs únicos de hoteles donde ha reservado
        this.hotelesReservados = [...new Set(reservaciones.map(r => r.id_hotel))];
      },
      (error) => {
        console.error('Error al obtener reservaciones del usuario', error);
      }
    );
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
    if (!id_hotel) return;

    if (!this.usuarioId) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Debes iniciar sesión para comentar',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          popup: 'small-toast'
        }
      });
      return;
    }

    // Verificar si el usuario ha reservado en este hotel
    if (!this.hotelesReservados.includes(id_hotel)) {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Solo puedes comentar hoteles donde hayas realizado reservaciones',
        text: 'Reserva una habitación en este hotel para compartir tu experiencia',
        toast: true,
        showConfirmButton: false,
        timer: 4000,
        customClass: {
          popup: 'medium-toast'
        }
      });
      return;
    }

    this.nuevoComentario.id_hotel = id_hotel;
    this.nuevoComentario.comentario = '';
    this.nuevoComentario.calificacion = 0;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
    this.checkBottomPosition();
  }

  checkBottomPosition() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    // Mostrar el botón de bajar solo si no estamos cerca del final (con un margen de 100px)
    this.showBottomButton = !(scrollPosition + windowHeight >= documentHeight - 100);
  }

  checkScrollPosition() {
    this.showNavigationButtons = window.pageYOffset > this.scrollThreshold;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
    this.showBottomButton = false;
    setTimeout(() => {
      this.checkBottomPosition();
    }, 1000);
  }

  getImageUrl(imageName: string | null | undefined): string {
    return this.hotelService.getImageUrl(imageName);
  }
}