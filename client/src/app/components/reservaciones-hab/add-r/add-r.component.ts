import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Reservaciones } from '../../../models/modelos';
import { ReservacionesService } from '../../../services/reservaciones.service';

@Component({
  selector: 'app-add-r',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-r.component.html',
  styleUrl: './add-r.component.css'
})
export class AddRComponent implements OnInit {
  reservacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private reservacionesSrv: ReservacionesService
  ) {
    this.reservacionForm = this.fb.group({
      id_usuario: [null, [Validators.required, Validators.min(1)]],
      id_habitacion: [null, [Validators.required, Validators.min(1)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      precio_total: [null, [Validators.required, Validators.min(0)]],
      estado: ['pendiente', Validators.required],
      fecha_reservacion: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.reservacionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    const reservacion: Reservaciones = {
      ...this.reservacionForm.value,
      fecha_reservacion: new Date().toISOString()
    };

    console.log('Enviando datos al backend:', reservacion);

    this.reservacionesSrv.saveReservacion(reservacion).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La reservación se ha guardado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar la reservación.'
        });
        console.error('Error guardando reservación:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }
}