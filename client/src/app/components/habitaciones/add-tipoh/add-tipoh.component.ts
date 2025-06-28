import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { TipoHabitacion } from '../../../models/modelos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-tipoh',
  standalone: false,
  templateUrl: './add-tipoh.component.html',
  styleUrl: './add-tipoh.component.css'
})
export class AddTipohComponent implements OnInit {
  tipoHabitacionForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private tipoHabitacionService: TipoHabitacionService
  ) {
    this.tipoHabitacionForm = this.fb.group({
      tipo_habitacion: ['', [Validators.required, Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      capacidad_personas: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.tipoHabitacionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos.'
      });
      return;
    }

    this.isSubmitting = true;

    const nuevoTipo: TipoHabitacion = {
      id_tipo_habitacion: 0, // El backend asignará el ID
      tipo_habitacion: this.tipoHabitacionForm.value.tipo_habitacion,
      precio: this.tipoHabitacionForm.value.precio,
      capacidad_personas: this.tipoHabitacionForm.value.capacidad_personas
    };

    this.tipoHabitacionService.createTipoHabitacion(nuevoTipo).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El tipo de habitación se ha registrado correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modal.close('success');
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al crear tipo de habitación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al registrar el tipo de habitación. Por favor, inténtelo nuevamente.'
        });
      }
    });
  }

  close() {
    if (this.tipoHabitacionForm.dirty) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Tienes cambios sin guardar. ¿Quieres salir de todos modos?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'No, quedarme'
      }).then((result) => {
        if (result.isConfirmed) {
          this.modal.dismiss();
        }
      });
    } else {
      this.modal.dismiss();
    }
  }

  get tipo_habitacion() {
    return this.tipoHabitacionForm.get('tipo_habitacion');
  }

  get precio() {
    return this.tipoHabitacionForm.get('precio');
  }

  get capacidad_personas() {
    return this.tipoHabitacionForm.get('capacidad_personas');
  }
}