import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Habitaciones } from '../../models/modelos';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HomeAdminComponent } from '../home-admin/home-admin.component';
import { AddHabitComponent } from './add-habit/add-habit.component';
import { UpdateHabitComponent } from './update-habit/update-habit.component';

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent implements OnInit {
  habitacionesget: Habitaciones[] = [];

  constructor(private habitacionesSrv: HabitacionesService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.getHabitaciones();
  }

  getHabitaciones() {
    this.habitacionesSrv.getHabitacion().subscribe(
      res => {
        this.habitacionesget = res;
        console.log('Habitaciones: ', + this.habitacionesget);
      },
      err => console.error('Error fetching habitaciones:', err)
    );
  }

  deleteHotel(id_habitacion: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.habitacionesSrv.deleteHabitacion(id_habitacion).subscribe(
          (resp: any) => {
            if (resp === '1') {
              Swal.fire({
                title: 'Error',
                text: 'Failed to delete habitacion.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            } else {
              Swal.fire({
                title: 'Eliminado Correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                this.getHabitaciones();
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

  cambiarEstatus(habId: number) {
    const habitacion = this.habitacionesget.find((h: Habitaciones) => h.id_habitacion === habId); // Tipar el parámetro e

    if (!habitacion) {
      Swal.fire({
        title: 'Error',
        text: 'Usuario no encontrado.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const updatedDisp = habitacion.disponibilidad === true ? true : false;

    const updatedHab: Habitaciones = {
      ...habitacion,
      disponibilidad: updatedDisp
    };

    this.habitacionesSrv.updateHabitacion(habitacion.id_habitacion, updatedHab).subscribe(
      () => {
        Swal.fire({
          title: 'Éxito',
          text: `Estatus cambiado a ${updatedDisp}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.getHabitaciones();
        if (updatedDisp === true) {
          // this.getEmailsAndSend();
        }
      },
      error => {
        console.error('Error al actualizar estatus:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estatus.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }

  openModal() {
    const modalRef = this.modal.open(AddHabitComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.dismissed.subscribe(() => {
      this.getHabitaciones();
    });

  }

  openModalEdit(prop: Habitaciones) {
    const modalRef = this.modal.open(UpdateHabitComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });

    modalRef.componentInstance.prop = prop; // Pasamos la habitación al modal

    modalRef.dismissed.subscribe(() => {
      this.getHabitaciones(); // Refrescar lista al cerrar modal
    });
  }
}
