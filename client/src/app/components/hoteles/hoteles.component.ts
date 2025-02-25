import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hoteles } from '../../models/modelos';
import { HotelesService } from '../../services/hoteles.service';
import Swal from 'sweetalert2';
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

  constructor(private hotelSrv: HotelesService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getHoteles();
  }

  getHoteles() {
    this.hotelSrv.getHotel().subscribe(
      res => {
        this.hotelesget = res;
      },
      err => console.error('Error fetching hoteles:', err)
    );
  }

  deleteHotel(id_hotel: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.hotelSrv.deleteHotel(id_hotel).subscribe(
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
                this.getHoteles();
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
    const modalRef = this.modal.open(AddHComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.dismissed.subscribe(() => {
      this.getHoteles();
    });

  }

  openModalEdit(prop: Hoteles) {
    const modalRef = this.modal.open(UpdateHComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = prop;
    modalRef.dismissed.subscribe(() => {
      this.getHoteles();
    });
  }
}
