import { Component, Input, OnInit } from '@angular/core';
import { Habitaciones, Reservaciones } from '../../../models/modelos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservacionesService } from '../../../services/reservaciones.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-update-r',
  standalone: false,
  templateUrl: './update-r.component.html',
  styleUrl: './update-r.component.css'
})
export class UpdateRComponent implements OnInit {
  @Input() prop?: Reservaciones;

  reservaForm: FormGroup;

  habitacionesget: Habitaciones[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private reservacionesSrv: ReservacionesService
  ) {
    this.reservaForm = this.fb.group({
      id_usuario: [null, [Validators.required, Validators.min(1)]],
      id_habitacion: [null, [Validators.required, Validators.min(1)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      precio_total: [null, [Validators.required, Validators.min(0)]],
      estado: ['pendiente', Validators.required],
      fecha_reservacion: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {
    if (this.prop) {
      // Asigna los valores a los campos del formulario
      this.reservaForm.patchValue({
        id_usuario: this.prop.id_usuario,
        id_habitacion: this.prop.id_habitacion,
        fecha_inicio: this.prop.fecha_inicio,
        fecha_fin: this.prop.fecha_fin,
        precio_total: this.prop.precio_total,
        estado: this.prop.estado,
        fecha_reservacion: this.prop.fecha_reservacion
      });
    }
  }

  onSubmit() {
    if (this.reservaForm.invalid) {
      return;
    }

    if (!this.prop || this.prop.id_reservacion === undefined) {
      console.error('Hotel ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El hotel no está definido.'
      });
      return;
    }

    // Obtener los valores actualizados del formulario
    const updatedHotel: Reservaciones = {
      ...this.prop,
      ...this.reservaForm.value
    };

    this.reservacionesSrv.updateReservacion(this.prop.id_reservacion, updatedHotel).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El hotel se ha actualizado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el hotel.'
        });
        console.error('Error updating hotel:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }
  
}
