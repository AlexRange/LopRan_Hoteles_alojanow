import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Hoteles, Reservaciones, Usuarios } from '../../models/modelos';
import { HotelesService } from '../../services/hoteles.service';
import { ReservacionesService } from '../../services/reservaciones.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AddRComponent } from './add-r/add-r.component';
import { UpdateRComponent } from './update-r/update-r.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservaciones-hab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservaciones-hab.component.html',
  styleUrls: ['./reservaciones-hab.component.css']
})
export class ReservacionesHabComponent implements OnInit {
  reservacionesget: Reservaciones[] = [];
  filteredReservaciones: any[] = [];
  isLoading: boolean = false;
  error: string = '';

  // Objetos para mapear IDs a nombres
  usuarios: {[key: number]: string} = {};
  hoteles: {[key: number]: string} = {};

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private reservacionesSrv: ReservacionesService,
    private usuariosSrv: UsuariosService,
    private hotelesSrv: HotelesService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    // Cargar usuarios
    this.usuariosSrv.getUsuarios().subscribe({
      next: (usuariosResponse: any) => {
        console.log('Respuesta completa de usuarios:', usuariosResponse);
        
        // Procesar usuarios - versión más flexible
        let usuariosList: Usuarios[] = [];
        
        if (Array.isArray(usuariosResponse)) {
          usuariosList = usuariosResponse;
        } else if (usuariosResponse && typeof usuariosResponse === 'object') {
          // Intentar extraer datos de varias formas comunes
          if (usuariosResponse.data) {
            usuariosList = Array.isArray(usuariosResponse.data) ? usuariosResponse.data : [];
          } else if (usuariosResponse.usuarios) {
            usuariosList = Array.isArray(usuariosResponse.usuarios) ? usuariosResponse.usuarios : [];
          } else if (usuariosResponse.result) {
            usuariosList = Array.isArray(usuariosResponse.result) ? usuariosResponse.result : [];
          } else {
            // Si es un objeto pero no tiene propiedades conocidas, convertir a array
            usuariosList = Object.keys(usuariosResponse).map(key => usuariosResponse[key]);
          }
        }
        
        console.log('Lista de usuarios procesada:', usuariosList);
        
        if (usuariosList.length === 0) {
          console.warn('No se encontraron usuarios en la respuesta');
        }

        // Crear mapeo de IDs a nombres
        usuariosList.forEach((usuario: Usuarios) => {
          if (usuario && usuario.id_usuario) {
            const nombreCompleto = [usuario.nombre]
              .filter(Boolean).join(' ');
            this.usuarios[usuario.id_usuario] = nombreCompleto || 'Nombre no disponible';
          }
        });
        console.log('Mapeo de usuarios creado:', this.usuarios);

        // Cargar hoteles
        this.hotelesSrv.getHotel().subscribe({
          next: (hotelesResponse: any) => {
            console.log('Respuesta completa de hoteles:', hotelesResponse);
            
            // Procesar hoteles de manera similar
            let hotelesList: Hoteles[] = [];
            
            if (Array.isArray(hotelesResponse)) {
              hotelesList = hotelesResponse;
            } else if (hotelesResponse && typeof hotelesResponse === 'object') {
              if (hotelesResponse.data) {
                hotelesList = Array.isArray(hotelesResponse.data) ? hotelesResponse.data : [];
              } else if (hotelesResponse.hoteles) {
                hotelesList = Array.isArray(hotelesResponse.hoteles) ? hotelesResponse.hoteles : [];
              } else if (hotelesResponse.result) {
                hotelesList = Array.isArray(hotelesResponse.result) ? hotelesResponse.result : [];
              } else {
                hotelesList = Object.keys(hotelesResponse).map(key => hotelesResponse[key]);
              }
            }
            
            console.log('Lista de hoteles procesada:', hotelesList);
            
            hotelesList.forEach((hotel: Hoteles) => {
              if (hotel && hotel.id_hotel) {
                this.hoteles[hotel.id_hotel] = hotel.nombre || 'Hotel sin nombre';
              }
            });
            console.log('Mapeo de hoteles creado:', this.hoteles);

            // Cargar reservaciones
            this.getReservaciones();
          },
          error: (err) => this.handleError('Error al cargar hoteles', err)
        });
      },
      error: (err) => this.handleError('Error al cargar usuarios', err)
    });
  }

  handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    this.isLoading = false;
    this.error = message;
    Swal.fire('Error', message, 'error');
  }

  getReservaciones(): void {
    this.reservacionesSrv.getReservaciones().subscribe({
      next: (res: Reservaciones[]) => {
        console.log('Reservaciones obtenidas:', res);
        this.reservacionesget = res;
        this.totalItems = res.length;
        this.calculateTotalPages();
        this.updateFilteredReservations();
        this.isLoading = false;
      },
      error: (err) => this.handleError('Error al cargar reservaciones', err)
    });
  }

  updateFilteredReservations(): void {
    console.log('Actualizando reservaciones filtradas...');
    console.log('Mapeo de usuarios disponible:', this.usuarios);
    console.log('Mapeo de hoteles disponible:', this.hoteles);
    
    this.filteredReservaciones = this.reservacionesget.map(reservacion => {
      const userId = Number(reservacion.id_usuario);
      const hotelId = Number(reservacion.id_hotel);

      console.log(`Procesando reservación ID: ${reservacion.id_reservacion}`);
      console.log(`ID Usuario: ${userId}, ID Hotel: ${hotelId}`);
      
      const nombreUsuario = !isNaN(userId) 
        ? (this.usuarios[userId] || 'Usuario no encontrado') 
        : 'ID inválido';
      
      const nombreHotel = !isNaN(hotelId) 
        ? (this.hoteles[hotelId] || 'Hotel no encontrado') 
        : 'ID inválido';

      console.log(`Nombre usuario encontrado: ${nombreUsuario}`);
      console.log(`Nombre hotel encontrado: ${nombreHotel}`);

      return {
        ...reservacion,
        nombreUsuario: nombreUsuario,
        nombreHotel: nombreHotel
      };
    });
    
    console.log('Reservaciones filtradas:', this.filteredReservaciones);
    this.applyPagination();
  }

  // ... (resto de los métodos de paginación se mantienen igual)
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    console.log(`Páginas calculadas: ${this.totalPages}, Página actual: ${this.currentPage}`);
  }

  applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.filteredReservaciones = this.filteredReservaciones.slice(startIndex, endIndex);
    console.log(`Aplicando paginación: Índices ${startIndex} a ${endIndex}`);
  }

  onItemsPerPageChange(): void {
    console.log(`Cambio en items por página: ${this.itemsPerPage}`);
    this.currentPage = 1;
    this.calculateTotalPages();
    this.applyPagination();
  }

  pageChanged(newPage: number): void {
    console.log(`Cambio de página solicitado a: ${newPage}`);
    this.currentPage = Math.max(1, Math.min(newPage, this.totalPages));
    this.applyPagination();
  }

  getEndIndex(): number {
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    console.log(`Calculando índice final: ${endIndex}`);
    return endIndex;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(startPage + maxVisiblePages - 1, this.totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    console.log(`Páginas visibles generadas: ${pages.join(', ')}`);
    return pages;
  }

  deleteReservacion(id_reservacion: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reservacionesSrv.deleteReservacion(id_reservacion).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La reservación ha sido eliminada', 'success');
            this.reservacionesget = this.reservacionesget.filter(r => r.id_reservacion !== id_reservacion);
            this.totalItems = this.reservacionesget.length;
            this.calculateTotalPages();
            this.updateFilteredReservations();
          },
          error: (error) => {
            console.error('Error eliminando reservación:', error);
            Swal.fire('Error', 'No se pudo eliminar la reservación', 'error');
          }
        });
      }
    });
  }

  openModal(): void {
    const modalRef = this.modal.open(AddRComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getReservaciones();
      }
    });
  }

  openModalEdit(reservacion: Reservaciones): void {
    const modalRef = this.modal.open(UpdateRComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.reservacion = reservacion;

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getReservaciones();
      }
    });
  }
}