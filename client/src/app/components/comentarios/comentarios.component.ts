import { Component, OnInit } from '@angular/core';
import { ComentariosCalificaciones } from '../../models/modelos';
import { ComentariosService } from '../../services/comentarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentarios',
  standalone: false,
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit {
  comentariosget: ComentariosCalificaciones[] = [];

  constructor(private comentariosSrv: ComentariosService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getComentarios();
  }

  getComentarios() {
    this.comentariosSrv.getComentarios().subscribe(
      res => {
        this.comentariosget = res;
      },
      err => console.error('Error fetching hoteles:', err)
    );
  }

  deleteComentario(id_comentario: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.comentariosSrv.deleteComentario(id_comentario).subscribe(
          (resp: any) => {
            if (resp === '1') {
              Swal.fire({
                title: 'Error',
                text: 'Failed to delete comentario.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Eliminado Correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                this.getComentarios();
              });
            }
          },
          (error: any) => {
            console.error('Error deleting instance:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete instance.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      }
    });
  }
}
