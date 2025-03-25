import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Reservaciones } from '../../models/modelos';
import { ReservacionesService } from '../../services/reservaciones.service';

@Component({
  selector: 'app-reservaciones-cliente',
  standalone: false,
  templateUrl: './reservaciones-cliente.component.html',
  styleUrl: './reservaciones-cliente.component.css'
})
export class ReservacionesClienteComponent implements OnInit, OnChanges {
  @Input() habitacion: any;
  reservacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservaSrv: ReservacionesService
  ) {
    this.reservacionForm = this.fb.group({
      id_habitacion: ['', Validators.required],
      id_usuario: ['4', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      precio_total: ['2000', Validators.required],
      estado: ['Pendiente', Validators.required],
      fecha_reservacion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    // Se asegura que la propiedad habitacion se asigne en el momento adecuado
    if (this.habitacion) {
      this.reservacionForm.patchValue({
        id_habitacion: this.habitacion.id_habitacion
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en habitacion y actualiza el formulario
    if (changes['habitacion'] && this.habitacion) {
      this.reservacionForm.patchValue({
        id_habitacion: this.habitacion.id_habitacion
      });
    }
  }

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
    };

    console.log('Enviando datos al backend:', reservacion);

    this.reservaSrv.saveReservacion(reservacion).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La reservación se ha guardado correctamente.'
        });
      },
      error => {
        let errorMessage = 'Hubo un problema al guardar la reservación.';

        if (error?.error?.error === 'Duplicate entry detected') {
          errorMessage = 'Ya existe una reservación con esos datos.';
        } else if (error?.status === 400) {
          errorMessage = 'Los datos ingresados son incorrectos.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });

        console.error('Error guardando reservación:', error);
      }
    );
  }
}