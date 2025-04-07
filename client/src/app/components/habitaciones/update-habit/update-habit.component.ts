import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Habitaciones, Hoteles } from '../../../models/modelos';
import { HabitacionesService } from '../../../services/habitaciones.service';
import { HotelesService } from '../../../services/hoteles.service';

@Component({
  selector: 'app-update-habit',
  standalone: false,
  templateUrl: './update-habit.component.html',
  styleUrl: './update-habit.component.css'
})
export class UpdateHabitComponent implements OnInit {
  @Input() prop?: Habitaciones;
  habitacionForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;
  currentImage: string = '';
  hotelesget: Hoteles[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private habitacionesSrv: HabitacionesService,
    private hotelSrv: HotelesService
  ) {
    this.habitacionForm = this.fb.group({
      id_hotel: ['', Validators.required],
      tipo_habitacion: ['', Validators.required],
      descripcion: [''],
      num_habitacion: ['', [Validators.required, Validators.min(1)]],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      precio_noche: ['', [Validators.required, Validators.min(0)]],
      disponibilidad: [true, Validators.required],
      imagen_habitacion: ['', Validators.required],
      descripcion_imagen_hab: ['']
    });
  }

  ngOnInit(): void {
    if (this.prop) {
      this.currentImage = this.prop.imagen_habitacion;
      this.habitacionForm.patchValue({
        id_hotel: this.prop.id_hotel,
        tipo_habitacion: this.prop.tipo_habitacion,
        descripcion: this.prop.descripcion,
        num_habitacion: this.prop.num_habitacion,
        capacidad: this.prop.capacidad,
        precio_noche: this.prop.precio_noche,
        disponibilidad: this.prop.disponibilidad,
        imagen_habitacion: this.prop.imagen_habitacion,
        descripcion_imagen_hab: this.prop.descripcion_imagen_hab
      });
    }
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

  onSubmit() {
    if (this.habitacionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos.'
      });
      return;
    }

    if (!this.prop || this.prop.id_habitacion === undefined) {
      console.error('Habitacion ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La habitación no está definida.'
      });
      return;
    }

    this.isSubmitting = true;

    if (this.selectedFile) {
      // Si hay una nueva imagen, subirla primero
      this.uploadImageAndUpdate();
    } else {
      // Si no hay nueva imagen, actualizar directamente
      this.updateHabitacion(this.currentImage);
    }
  }

  private uploadImageAndUpdate() {
    if (!this.selectedFile) return;

    this.habitacionesSrv.uploadImage(this.selectedFile).subscribe({
      next: (uploadResponse) => {
        // Actualizar tanto el formulario como la imagen actual
        this.currentImage = uploadResponse.filename;
        this.habitacionForm.patchValue({
          imagen_habitacion: uploadResponse.filename
        });

        // Forzar la actualización del formulario
        this.habitacionForm.updateValueAndValidity();

        // Luego actualizar la habitación
        this.updateHabitacion(uploadResponse.filename);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al subir la imagen:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al subir la imagen. Por favor, inténtelo nuevamente.'
        });
      }
    });
  }

  private updateHabitacion(imageFilename: string) {
    const formValues = this.habitacionForm.value;

    // Asegurarse de que disponibilidad es booleano
    const disponibilidad = formValues.disponibilidad === 'true' || formValues.disponibilidad === true;

    const updatedHabitacion: Habitaciones = {
      id_habitacion: this.prop!.id_habitacion,
      id_hotel: formValues.id_hotel,
      tipo_habitacion: formValues.tipo_habitacion,
      descripcion: formValues.descripcion,
      num_habitacion: formValues.num_habitacion,
      capacidad: formValues.capacidad,
      precio_noche: formValues.precio_noche,
      disponibilidad: disponibilidad, // Usar el valor convertido a booleano
      imagen_habitacion: imageFilename,
      descripcion_imagen_hab: formValues.descripcion_imagen_hab
    };

    this.habitacionesSrv.updateHabitacion(this.prop!.id_habitacion, updatedHabitacion).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La habitación se ha actualizado correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modal.close('success');
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar la habitación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar la habitación. Por favor, inténtelo nuevamente.'
        });
      }
    });
  }

  close() {
    if (this.habitacionForm.dirty) {
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño máximo (5MB como en el backend)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'La imagen no debe exceder los 5MB.'
        });
        event.target.value = '';
        this.selectedFile = null;
        return;
      }

      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Formato no soportado',
          text: 'Solo se aceptan imágenes en formato JPG, JPEG o PNG.'
        });
        event.target.value = '';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.habitacionForm.patchValue({ imagen_habitacion: 'pending_upload' }); // Valor temporal
    }
  }

  getImageUrl(imageName: string | null | undefined): string {
    return this.habitacionesSrv.getImageUrl(imageName);
  }
}