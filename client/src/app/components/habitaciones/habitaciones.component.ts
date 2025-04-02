import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Habitaciones, Hoteles } from '../../models/modelos';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HotelesService } from '../../services/hoteles.service';
import { AddHabitComponent } from './add-habit/add-habit.component';
import { UpdateHabitComponent } from './update-habit/update-habit.component';

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  habitacionesget: Habitaciones[] = [];
  filteredHabitaciones: any[] = [];
  hoteles: Hoteles[] = [];
  isLoading: boolean = false;
  expandedDesc: { [key: number]: boolean } = {};

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private habitacionesSrv: HabitacionesService, 
    private hotelesSrv: HotelesService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    this.hotelesSrv.getHotel().subscribe({
      next: (hoteles) => {
        this.hoteles = hoteles;
        this.getHabitaciones();
      },
      error: (err) => {
        console.error('Error fetching hoteles:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los hoteles', 'error');
      }
    });
  }

  getHabitaciones() {
    this.habitacionesSrv.getHabitacion().subscribe({
      next: (res) => {
        this.habitacionesget = res;
        this.totalItems = res.length;
        this.calculateTotalPages();
        this.updateFilteredHabitaciones();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching habitaciones:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar las habitaciones', 'error');
      }
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateFilteredHabitaciones() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    
    this.filteredHabitaciones = this.habitacionesget
      .map(habitacion => {
        const hotel = this.hoteles.find(h => h.id_hotel === habitacion.id_hotel);
        return {
          ...habitacion,
          nombre_hotel: hotel ? hotel.nombre : 'Desconocido'
        };
      })
      .slice(startIndex, endIndex);
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateFilteredHabitaciones();
  }

  pageChanged(newPage: number) {
    newPage = Math.max(1, Math.min(newPage, this.totalPages));
    
    if (this.currentPage !== newPage) {
      this.currentPage = newPage;
      this.updateFilteredHabitaciones();
    }
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
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
    
    return pages;
  }

  // Resto de los métodos permanecen igual...
  toggleExpandDesc(id_habitacion: number) {
    this.expandedDesc[id_habitacion] = !this.expandedDesc[id_habitacion];
  }

  deleteHabitacion(id_habitacion: number) {
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
        this.habitacionesSrv.deleteHabitacion(id_habitacion).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La habitación ha sido eliminada', 'success');
            this.habitacionesget = this.habitacionesget.filter(hab => hab.id_habitacion !== id_habitacion);
            this.totalItems = this.habitacionesget.length;
            this.calculateTotalPages();
            this.updateFilteredHabitaciones();
          },
          error: (error) => {
            console.error('Error deleting habitación:', error);
            Swal.fire('Error', 'No se pudo eliminar la habitación', 'error');
          }
        });
      }
    });
  }

  cambiarEstatus(habId: number) {
    const habitacion = this.habitacionesget.find(h => h.id_habitacion === habId);

    if (!habitacion) {
      Swal.fire('Error', 'Habitación no encontrada', 'error');
      return;
    }

    const updatedDisp = !habitacion.disponibilidad;

    const updatedHab: Habitaciones = {
      ...habitacion,
      disponibilidad: updatedDisp
    };

    this.habitacionesSrv.updateHabitacion(habitacion.id_habitacion, updatedHab).subscribe({
      next: () => {
        Swal.fire('Éxito', `Estado cambiado a ${updatedDisp ? 'Disponible' : 'Ocupada'}`, 'success');
        this.getHabitaciones();
      },
      error: (error) => {
        console.error('Error al actualizar estatus:', error);
        Swal.fire('Error', 'No se pudo actualizar el estatus', 'error');
      }
    });
  }

  openModal() {
    const modalRef = this.modal.open(AddHabitComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.loadData();
      }
    });
  }

  openModalEdit(hab: Habitaciones) {
    const modalRef = this.modal.open(UpdateHabitComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = hab;

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.loadData();
      }
    });
  }
}