import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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
  imagenHotelBase64: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modal: NgbActiveModal,
    private hotelService: HotelesService
  ) {
    this.hotelForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      descripcion: ['', Validators.required],
      estrellas: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      imagen_hotel: ['', Validators.required],
      descripcion_imagen_hot: ['', Validators.required],
      fecha_registro: [new Date().toISOString()]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.hotelForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    const hotel: Hoteles = {
      ...this.hotelForm.value,
      fecha_registro: new Date().toISOString()
  };

  console.log('Enviando datos al backend:', hotel);

    this.hotelService.saveHotel(hotel).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El hotel se ha guardado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar el hotel.'
        });
        console.error('Error guardando hotel:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenHotelBase64 = reader.result as string;
        this.hotelForm.patchValue({ imagen_hotel: this.imagenHotelBase64 });
      };
      reader.readAsDataURL(file);
    }
  }
}
