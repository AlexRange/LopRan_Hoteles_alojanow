import { Component, OnInit } from '@angular/core';
import { ComentariosCalificaciones } from '../../models/modelos';
import { ComentariosService } from '../../services/comentarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentarios',
  standalone: false,
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css']
})
export class ComentariosComponent implements OnInit {
  comentariosget: ComentariosCalificaciones[] = [];
  filteredComentarios: ComentariosCalificaciones[] = [];
  isLoading: boolean = false;
  expandedDesc: { [key: number]: boolean } = {};

  // Variables de paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(private comentariosSrv: ComentariosService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getComentarios();
  }

  getComentarios() {
    this.isLoading = true;
    this.comentariosSrv.getComentarios().subscribe({
      next: (res) => {
        this.comentariosget = res;
        this.totalItems = res.length;
        this.calculateTotalPages();
        this.updateFilteredComentarios();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching comentarios:', err);
        this.isLoading = false;
        Swal.fire('Error', 'No se pudieron cargar los comentarios', 'error');
      }
    });
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateFilteredComentarios() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);
    this.filteredComentarios = this.comentariosget.slice(startIndex, endIndex);
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateFilteredComentarios();
  }

  pageChanged(newPage: number) {
    newPage = Math.max(1, Math.min(newPage, this.totalPages));
    
    if (this.currentPage !== newPage) {
      this.currentPage = newPage;
      this.updateFilteredComentarios();
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

  toggleExpandDesc(id_comentario: number) {
    this.expandedDesc[id_comentario] = !this.expandedDesc[id_comentario];
  }

  deleteComentario(id_comentario: number) {
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
        this.comentariosSrv.deleteComentario(id_comentario).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El comentario ha sido eliminado', 'success');
            this.comentariosget = this.comentariosget.filter(coment => coment.id_comentario !== id_comentario);
            this.totalItems = this.comentariosget.length;
            this.calculateTotalPages();
            this.updateFilteredComentarios();
          },
          error: (error) => {
            console.error('Error deleting comentario:', error);
            Swal.fire('Error', 'No se pudo eliminar el comentario', 'error');
          }
        });
      }
    });
  }
}