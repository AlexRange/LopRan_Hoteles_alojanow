import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Habitaciones, Hoteles } from '../../../models/modelos';
import { HabitacionesService } from '../../../services/habitaciones.service';
import { HotelesService } from '../../../services/hoteles.service';

@Component({
  selector: 'app-add-habit',
  standalone: false,
  templateUrl: './add-habit.component.html',
  styleUrl: './add-habit.component.css'
})
export class AddHabitComponent implements OnInit {
  habitacionForm: FormGroup;
  selectedFile: File | null = null;
  hotelesget: Hoteles[] = [];
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modal: NgbActiveModal,
    private habitService: HabitacionesService,
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
    if (this.habitacionForm.invalid || !this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos y suba una imagen de la habitación.'
      });
      return;
    }

    this.isSubmitting = true;

    // First upload the image
    this.habitService.uploadImage(this.selectedFile).subscribe({
      next: (uploadResponse) => {
        // Once image is uploaded, save the habitacion with the filename
        const habitacion: Habitaciones = {
          ...this.habitacionForm.value,
          imagen_habitacion: uploadResponse.filename, // Store the filename
          id_habitacion: 0 // Temporary value, will be ignored by backend
        };

        this.habitService.saveHabitacion(habitacion).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'La habitación se ha registrado correctamente.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.modal.close('success');
            });
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error al guardar la habitación:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al registrar la habitación. Por favor, inténtelo nuevamente.'
            });
          }
        });
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
      this.habitacionForm.patchValue({ imagen_habitacion: 'pending_upload' }); // Temporary value
    }
  }
}