import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Hoteles } from '../../models/modelos';
import { HotelesService } from '../../services/hoteles.service';
import { AddHComponent } from './add-h/add-h.component';
import { UpdateHComponent } from './update-h/update-h.component';

@Component({
  selector: 'app-hoteles',
  standalone: false,
  templateUrl: './hoteles.component.html',
  styleUrl: './hoteles.component.css'
})
export class HotelesComponent implements OnInit {
  hotelesget: Hoteles[] = [];
  filteredHoteles: Hoteles[] = [];
  isLoading: boolean = false;
  expandedDesc: { [key: number]: boolean } = {};

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Valor inicial cambiado a 5
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private hotelSrv: HotelesService, private modal: NgbModal, private hotelesService: HotelesService) { }

  ngOnInit(): void {
    this.getHoteles();
  }

  getHoteles() {
    this.isLoading = true;
    this.hotelSrv.getHotel().subscribe({
      next: (res) => {
        this.hotelesget = res;
        this.totalItems = res.length;
        this.calculateTotalPages();
        this.updateFilteredHoteles();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching hoteles:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los hoteles', 'error');
      }
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    // Ajustar currentPage si es necesario
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateFilteredHoteles() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.filteredHoteles = this.hotelesget.slice(startIndex, endIndex);
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Resetear a la primera página
    this.calculateTotalPages();
    this.updateFilteredHoteles();
  }

  pageChanged(newPage: number) {
    newPage = Math.max(1, Math.min(newPage, this.totalPages));
    
    if (this.currentPage !== newPage) {
      this.currentPage = newPage;
      this.updateFilteredHoteles();
    }
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    // Caso cuando hay pocas páginas
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Calcular páginas alrededor de la actual
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(startPage + maxVisiblePages - 1, this.totalPages);
    
    // Ajustar si nos pasamos
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  toggleExpandDesc(id_hotel: number) {
    this.expandedDesc[id_hotel] = !this.expandedDesc[id_hotel];
  }

  deleteHotel(id_hotel: number) {
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
        this.hotelSrv.deleteHotel(id_hotel).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El hotel ha sido eliminado', 'success');
            this.hotelesget = this.hotelesget.filter(hotel => hotel.id_hotel !== id_hotel);
            this.totalItems = this.hotelesget.length;
            this.calculateTotalPages();
            this.updateFilteredHoteles();
          },
          error: (error) => {
            console.error('Error deleting hotel:', error);
            Swal.fire('Error', 'No se pudo eliminar el hotel', 'error');
          }
        });
      }
    });
  }

  openModal() {
    const modalRef = this.modal.open(AddHComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getHoteles();
      }
    });
  }

  openModalEdit(hotel: Hoteles) {
    const modalRef = this.modal.open(UpdateHComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = hotel;

    modalRef.closed.subscribe((result) => {
      if (result === 'success') {
        this.getHoteles();
      }
    });
  }

  getImageUrl(imageName: string | null | undefined): string {
    return this.hotelesService.getImageUrl(imageName);
  }
}