import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Hoteles } from '../../../models/modelos';
import { HotelesService } from '../../../services/hoteles.service';

@Component({
  selector: 'app-update-h',
  standalone: false,
  templateUrl: './update-h.component.html',
  styleUrl: './update-h.component.css'
})
export class UpdateHComponent implements OnInit {
  @Input() prop?: Hoteles;
  hotelForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;
  currentImage: string = '';

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private hotelService: HotelesService
  ) {
    this.hotelForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      ciudad: ['', [Validators.required, Validators.maxLength(100)]],
      pais: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.required],
      estrellas: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      imagen_hotel: ['', Validators.required],
      descripcion_imagen_hot: ['', [Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    if (this.prop) {
      this.currentImage = this.prop.imagen_hotel;
      // Asigna los valores a los campos del formulario
      this.hotelForm.patchValue({
        nombre: this.prop.nombre,
        direccion: this.prop.direccion,
        ciudad: this.prop.ciudad,
        pais: this.prop.pais,
        descripcion: this.prop.descripcion,
        estrellas: this.prop.estrellas,
        imagen_hotel: this.prop.imagen_hotel,
        descripcion_imagen_hot: this.prop.descripcion_imagen_hot
      });
    }
  }

  onSubmit() {
    if (this.hotelForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor, complete todos los campos requeridos.'
      });
      return;
    }

    if (!this.prop || this.prop.id_hotel === undefined) {
      console.error('Hotel ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El hotel no está definido.'
      });
      return;
    }

    this.isSubmitting = true;

    if (this.selectedFile) {
      // Si hay una nueva imagen, subirla primero
      this.uploadImageAndUpdate();
    } else {
      // Si no hay nueva imagen, actualizar directamente
      this.updateHotel(this.currentImage);
    }
  }

  private uploadImageAndUpdate() {
    if (!this.selectedFile) return;

    this.hotelService.uploadImage(this.selectedFile).subscribe({
      next: (uploadResponse) => {
        // Actualizar tanto el formulario como la imagen actual
        this.currentImage = uploadResponse.filename;
        this.hotelForm.patchValue({
          imagen_hotel: uploadResponse.filename
        });

        // Forzar la actualización del formulario
        this.hotelForm.updateValueAndValidity();

        // Luego actualizar el hotel
        this.updateHotel(uploadResponse.filename);
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

  private updateHotel(imageFilename: string) {
    // Crear el objeto con los valores actuales del formulario
    const formValues = this.hotelForm.value;

    const updatedHotel: Hoteles = {
      id_hotel: this.prop!.id_hotel,
      nombre: formValues.nombre,
      direccion: formValues.direccion,
      ciudad: formValues.ciudad,
      pais: formValues.pais,
      descripcion: formValues.descripcion,
      estrellas: formValues.estrellas,
      imagen_hotel: imageFilename, // Usar el nuevo nombre de archivo
      descripcion_imagen_hot: formValues.descripcion_imagen_hot,
      // Mantener otros campos necesarios
      zona: this.prop?.zona || '',
      fecha_registro: this.prop?.fecha_registro || new Date().toISOString()
    };

    console.log('Datos a enviar para actualización:', updatedHotel);

    this.hotelService.updateHotel(this.prop!.id_hotel, updatedHotel).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El hotel se ha actualizado correctamente.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.modal.close('success');
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error al actualizar el hotel:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el hotel. Por favor, inténtelo nuevamente.'
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
      this.hotelForm.patchValue({ imagen_hotel: 'pending_upload' }); // Valor temporal
    }
  }

  getImageUrl(imageName: string | null | undefined): string {
    return this.hotelService.getImageUrl(imageName);
  }
}