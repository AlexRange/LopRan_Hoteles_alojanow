import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Hoteles } from '../../../models/modelos';
import { HotelesService } from '../../../services/hoteles.service';

@Component({
  selector: 'app-add-h',
  standalone: false,
  templateUrl: './add-h.component.html',
  styleUrl: './add-h.component.css'
})
export class AddHComponent implements OnInit {
  hotelForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private hotelService: HotelesService
  ) {
    this.hotelForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      zona: ['', [Validators.required, Validators.maxLength(50)]],
      ciudad: ['', [Validators.required, Validators.maxLength(100)]],
      pais: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      estrellas: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      imagen_hotel: ['', Validators.required],
      descripcion_imagen_hot: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.hotelForm.invalid || !this.selectedFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos y suba una imagen del hotel.'
      });
      return;
    }

    this.isSubmitting = true;

    // First upload the image
    this.hotelService.uploadImage(this.selectedFile).subscribe({
      next: (uploadResponse) => {
        // Once image is uploaded, save the hotel with the filename
        const hotel: Hoteles = {
          ...this.hotelForm.value,
          imagen_hotel: uploadResponse.filename, // Store the filename
          fecha_registro: new Date().toISOString()
        };

        this.hotelService.saveHotel(hotel).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'El hotel se ha registrado correctamente.',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.modal.close('success');
            });
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Error al guardar el hotel:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al registrar el hotel. Por favor, inténtelo nuevamente.'
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
    if (this.hotelForm.dirty) {
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
      this.hotelForm.patchValue({ imagen_hotel: 'pending_upload' }); // Temporary value
    }
  }
}