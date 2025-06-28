import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TipoHabitacion } from '../../../models/modelos';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';

@Component({
  selector: 'app-update-tipoh',
  standalone: false,
  templateUrl: './update-tipoh.component.html',
  styleUrl: './update-tipoh.component.css'
})
export class UpdateTipohComponent implements OnInit {
@Input() tipoHabitacion?: TipoHabitacion;  // Cambiar prop por tipoHabitacion
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

  ngOnInit(): void {
    console.log('Prop received:', this.tipoHabitacion); // Agrega esto para depuración
    if (this.tipoHabitacion) {
      console.log('Patching form with:', {
        tipo_habitacion: this.tipoHabitacion.tipo_habitacion,
        precio: this.tipoHabitacion.precio,
        capacidad_personas: this.tipoHabitacion.capacidad_personas
      });
      
      this.tipoHabitacionForm.patchValue({
        tipo_habitacion: this.tipoHabitacion.tipo_habitacion,
        precio: this.tipoHabitacion.precio,
        capacidad_personas: this.tipoHabitacion.capacidad_personas
      });
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

  onSubmit() {
    if (this.tipoHabitacionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos.'
      });
      return;
    }

    if (!this.tipoHabitacion || this.tipoHabitacion.id_tipo_habitacion === undefined) {
      console.error('Tipo de habitación ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El tipo de habitación no está definido.'
      });
      return;
    }

    this.isSubmitting = true;

    const formValues = this.tipoHabitacionForm.value;
    const updatedTipoHabitacion: TipoHabitacion = {
      id_tipo_habitacion: this.tipoHabitacion.id_tipo_habitacion,
      tipo_habitacion: formValues.tipo_habitacion,
      precio: formValues.precio,
      capacidad_personas: formValues.capacidad_personas
    };

    this.tipoHabitacionService.updateTipoHabitacion(this.tipoHabitacion.id_tipo_habitacion, updatedTipoHabitacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El tipo de habitación se ha actualizado correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modal.close('success');
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar el tipo de habitación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el tipo de habitación. Por favor, inténtelo nuevamente.'
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
}
