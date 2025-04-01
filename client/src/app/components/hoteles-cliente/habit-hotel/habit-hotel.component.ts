import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComentariosCalificaciones } from '../../../models/modelos';
import { ComentariosService } from '../../../services/comentarios.service';
import { HabitacionesService } from '../../../services/habitaciones.service';
import { HotelesService } from '../../../services/hoteles.service';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-habit-hotel',
  standalone: false,
  templateUrl: './habit-hotel.component.html',
  styleUrls: ['./habit-hotel.component.css']
})
export class HabitHotelComponent implements OnInit, AfterViewInit {
  @ViewChild('comentariosContainer', { static: false }) comentariosContainer!: ElementRef;

  id_hotel!: number;
  hotelNombre: string = '';
  habitaciones: any[] = [];
  habitacionSeleccionada: any = null;
  comentarios: ComentariosCalificaciones[] = [];
  mostrarComentarios: boolean = false;
  loadingComentarios: boolean = false;
  errorCargandoComentarios: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private habitacionesService: HabitacionesService,
    private hotelesService: HotelesService,
    private comentariosService: ComentariosService,
    private modalService: NgbModal,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id_hotel'];

      if (idParam) {
        this.id_hotel = Number(idParam);
        if (!isNaN(this.id_hotel)) {
          this.cargarHabitaciones();
          this.cargarHotel();
        } else {
          console.error('Error: id_hotel no es un número válido');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Configurar el evento click del botón después de que la vista se haya inicializado
    const toggleBtn = this.elementRef.nativeElement.querySelector('#toggleComentariosBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleComentarios());
    }
  }

  cargarHabitaciones(): void {
    this.habitacionesService.getHabitacionesByHotel(this.id_hotel).subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
      }
    });
  }

  cargarHotel(): void {
    this.hotelesService.getHotel().subscribe({
      next: (hoteles) => {
        const hotelEncontrado = hoteles.find(hotel => hotel.id_hotel === this.id_hotel);
        if (hotelEncontrado) {
          this.hotelNombre = hotelEncontrado.nombre;
        } else {
          console.warn('No se encontró el hotel con el ID:', this.id_hotel);
        }
      },
      error: (err) => {
        console.error('Error al cargar hoteles:', err);
      }
    });
  }

  abrirModal(habitacion: any): void {
    this.habitacionSeleccionada = habitacion;
    let modalElement = document.getElementById('reservacionModal');

    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('No se encontró el elemento del modal en el DOM.');
    }
  }

  // Cambia el método toggleComentarios() por este:
  toggleComentarios(): void {
    const comentariosContainer = this.elementRef.nativeElement.querySelector('#comentariosContainer');
    const toggleBtn = this.elementRef.nativeElement.querySelector('#toggleComentariosBtn');

    this.mostrarComentarios = !this.mostrarComentarios;

    if (this.mostrarComentarios) {
      // Mostrar contenedor con transición
      comentariosContainer.classList.add('visible');
      toggleBtn.textContent = 'Ocultar Comentarios';

      // Cargar comentarios si no están cargados
      if (this.comentarios.length === 0 && !this.loadingComentarios) {
        this.cargarComentarios();
      } else {
        this.renderizarComentarios();
      }
    } else {
      // Ocultar contenedor con transición
      comentariosContainer.classList.remove('visible');
      toggleBtn.textContent = 'Ver Comentarios del Hotel';
    }
  }

  // Y actualiza el método renderizarComentarios() para incluir los delays de animación:
  renderizarComentarios(): void {
    const comentariosContainer = this.elementRef.nativeElement.querySelector('#comentariosContainer');

    if (this.comentarios.length === 0) {
      comentariosContainer.innerHTML = `
      <div class="alert alert-info">
        No hay comentarios para este hotel aún. Sé el primero en opinar.
      </div>
    `;
      return;
    }

    // Crear elementos del DOM para los comentarios
    let html = `
    <h3 class="mb-3">Comentarios sobre ${this.hotelNombre}</h3>
    <div class="list-group">
  `;

    this.comentarios.forEach((comentario, index) => {
      html += `
      <div class="list-group-item mb-3 comentario-item" style="animation-delay: ${index * 0.1}s">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">Usuario #${comentario.id_usuario}</h5>
          <small class="text-muted">${this.formatFecha(comentario.fecha_comentario)}</small>
        </div>
        <div class="mb-2">${this.generarEstrellas(comentario.calificacion)}</div>
        <p class="mb-1">${comentario.comentario || 'El usuario no dejó un comentario escrito.'}</p>
      </div>
    `;
    });

    html += `</div>`;
    comentariosContainer.innerHTML = html;
  }

  cargarComentarios(): void {
    this.loadingComentarios = true;
    this.errorCargandoComentarios = false;

    // Mostrar indicador de carga
    this.mostrarCargandoComentarios();

    this.comentariosService.getComentarios().subscribe({
      next: (comentarios: ComentariosCalificaciones[]) => {
        this.comentarios = comentarios
          .filter(c => c.id_hotel === this.id_hotel)
          .sort((a, b) =>
            new Date(b.fecha_comentario).getTime() - new Date(a.fecha_comentario).getTime()
          );

        this.loadingComentarios = false;
        this.renderizarComentarios();
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
        this.errorCargandoComentarios = true;
        this.loadingComentarios = false;
        this.mostrarErrorComentarios();
      }
    });
  }

  mostrarCargandoComentarios(): void {
    const comentariosContainer = this.elementRef.nativeElement.querySelector('#comentariosContainer');
    comentariosContainer.innerHTML = `
      <div class="loading-comentarios text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando comentarios...</p>
      </div>
    `;
  }

  mostrarErrorComentarios(): void {
    const comentariosContainer = this.elementRef.nativeElement.querySelector('#comentariosContainer');
    comentariosContainer.innerHTML = `
      <div class="alert alert-danger">
        Ocurrió un error al cargar los comentarios. Por favor, intenta nuevamente más tarde.
      </div>
    `;
  }

  generarEstrellas(calificacion: number): string {
    const estrellasLlenas = Math.floor(calificacion);
    const tieneMediaEstrella = calificacion % 1 >= 0.5;
    const estrellasVacias = 5 - estrellasLlenas - (tieneMediaEstrella ? 1 : 0);

    let html = '';

    // Estrellas llenas
    for (let i = 0; i < estrellasLlenas; i++) {
      html += '<i class="fas fa-star text-warning"></i> ';
    }

    // Media estrella (si aplica)
    if (tieneMediaEstrella) {
      html += '<i class="fas fa-star-half-alt text-warning"></i> ';
    }

    // Estrellas vacías
    for (let i = 0; i < estrellasVacias; i++) {
      html += '<i class="far fa-star text-warning"></i> ';
    }

    return html;
  }

  formatFecha(fechaString: string): string {
    if (!fechaString) return '';

    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return fechaString;
    }
  }
}