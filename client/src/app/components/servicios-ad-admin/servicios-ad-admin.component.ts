import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiciosAdicionales } from '../../models/modelos';
import { ServiciosAdicionalesService } from '../../services/servicios-adicionales.service';
import { AddSComponent } from './add-s/add-s.component';
import { AsignarAHotelComponent } from './asignar-a-hotel/asignar-a-hotel.component';
import { UpdateSComponent } from './update-s/update-s.component';

@Component({
  selector: 'app-servicios-ad-admin',
  standalone: false,
  templateUrl: './servicios-ad-admin.component.html',
  styleUrl: './servicios-ad-admin.component.css'
})
export class ServiciosAdAdminComponent implements OnInit {
  servviciosget: ServiciosAdicionales[] = [];
  filteredServicios: ServiciosAdicionales[] = [];
  expanded: { [key: number]: boolean } = {};
  isLoading: boolean = false;

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private modal: NgbModal, private serviciosSrv: ServiciosAdicionalesService) { }

  ngOnInit(): void {
    this.getServicios();
  }

  getServicios() {
    this.isLoading = true;
    this.serviciosSrv.getServicios().subscribe({
      next: (res) => {
        this.servviciosget = res;
        this.totalItems = res.length;
        this.calculateTotalPages();
        this.updateFilteredServicios();
        this.expanded = {};
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching servicios:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
      }
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateFilteredServicios() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.filteredServicios = this.servviciosget.slice(startIndex, endIndex);
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateFilteredServicios();
  }

  pageChanged(newPage: number) {
    newPage = Math.max(1, Math.min(newPage, this.totalPages));
    
    if (this.currentPage !== newPage) {
      this.currentPage = newPage;
      this.updateFilteredServicios();
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

  toggleExpand(id_servicio: number) {
    this.expanded[id_servicio] = !this.expanded[id_servicio];
  }

  deleteReservacion(id_servicio: number) {
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
        this.serviciosSrv.deleteServicio(id_servicio).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El servicio ha sido eliminado', 'success');
            this.servviciosget = this.servviciosget.filter(serv => serv.id_servicio !== id_servicio);
            this.totalItems = this.servviciosget.length;
            this.calculateTotalPages();
            this.updateFilteredServicios();
          },
          error: (error) => {
            console.error('Error deleting servicio:', error);
            Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
          }
        });
      }
    });
  }

  openModal() {
    const modalRef = this.modal.open(AddSComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getServicios();
      }
    });
  }

  openModalEdit(serv: ServiciosAdicionales) {
    const modalRef = this.modal.open(UpdateSComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = serv;

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getServicios();
      }
    });
  }

  openAssignModal(id_servicio: number) {
    const modalRef = this.modal.open(AsignarAHotelComponent, {
        backdrop: 'static',
        size: 'lg',
        centered: true
    });
    
    modalRef.componentInstance.id_servicio = id_servicio;

    modalRef.closed.subscribe(() => {
        this.getServicios();
    });
  }
}