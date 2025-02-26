import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Promociones } from '../../models/modelos';
import { PromocionesService } from '../../services/promociones.service';
import { AddPComponent } from './add-p/add-p.component';
import { UpdatePComponent } from './update-p/update-p.component';

@Component({
  selector: 'app-promociones',
  standalone: false,
  templateUrl: './promociones.component.html',
  styleUrl: './promociones.component.css'
})
export class PromocionesComponent implements OnInit {
  promocionesget: Promociones[] = [];

  constructor(private promSrv: PromocionesService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getPromociones();
  }

  getPromociones() {
    this.promSrv.getPromociones().subscribe(
      res => {
        this.promocionesget = res;
      },
      err => console.error('Error fetching hoteles:', err)
    );
  }

  deletePromocion(id_promocion: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.promSrv.deletePromocion(id_promocion).subscribe(
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
                this.getPromociones();
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
    const modalRef = this.modal.open(AddPComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.dismissed.subscribe(() => {
      this.getPromociones();
    });

  }

  openModalEdit(prop: Promociones) {
    const modalRef = this.modal.open(UpdatePComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
    modalRef.componentInstance.prop = prop;
    modalRef.dismissed.subscribe(() => {
      this.getPromociones();
    });
  }
}
