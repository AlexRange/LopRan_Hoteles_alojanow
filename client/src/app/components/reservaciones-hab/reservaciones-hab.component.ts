import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Reservaciones } from '../../models/modelos';
import { ReservacionesService } from '../../services/reservaciones.service';
import { AddRComponent } from './add-r/add-r.component';
import { UpdateRComponent } from './update-r/update-r.component';

@Component({
  selector: 'app-reservaciones-hab',
  standalone: false,
  templateUrl: './reservaciones-hab.component.html',
  styleUrl: './reservaciones-hab.component.css'
})
export class ReservacionesHabComponent implements OnInit {
  reservacionesget: Reservaciones[] = [];

  constructor(private reservacionesSrv: ReservacionesService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getReservaciones();
  }

  getReservaciones() {
    this.reservacionesSrv.getReservaciones().subscribe(
      res => {
        this.reservacionesget = res;
      },
      err => console.error('Error fetching reservaciones:', err)
    );
  }

  deleteReservacion(id_reservacion: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.reservacionesSrv.deleteReservacion(id_reservacion).subscribe(
          (resp: any) => {
            if (resp === '1') {
              Swal.fire({
                title: 'Error',
                text: 'Failed to delete usuario.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Eliminado Correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                this.getReservaciones();
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

  openModal() {
    const modalRef = this.modal.open(AddRComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.dismissed.subscribe(() => {
      this.getReservaciones();
    });

  }

  openModalEdit(prop: Reservaciones) {
    const modalRef = this.modal.open(UpdateRComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = prop;
    modalRef.dismissed.subscribe(() => {
      this.getReservaciones();
    });
  }
}
