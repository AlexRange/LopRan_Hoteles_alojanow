import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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

  hotelesget: Hoteles[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private hotelesSrv: HotelesService
  ) {
    this.hotelForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      descripcion: ['', Validators.required],
      estrellas: ['', Validators.required],
      imagen_hotel: ['', Validators.required],
      descripcion_imagen_hot: ['']
    });
  }

  ngOnInit(): void {
    if (this.prop) {
      // Asigna los valores a los campos del formulario
      this.hotelForm.patchValue({
        nombre: this.prop.nombre,
        direccion: this.prop.direccion,
        ciudad: this.prop.ciudad,
        pais: this.prop.pais,
        descripcion: this.prop.descripcion,
        estrellas: this.prop.estrellas,
        descripcion_imagen_hot: this.prop.descripcion_imagen_hot
      });
    }
  }

  onSubmit() {
    if (this.hotelForm.invalid) {
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

    // Obtener los valores actualizados del formulario
    const updatedHotel: Hoteles = {
      ...this.prop,
      ...this.hotelForm.value
    };

    this.hotelesSrv.updateHotel(this.prop.id_hotel, updatedHotel).subscribe(
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Crear un nuevo FileReader para convertir la imagen a base64
      const reader = new FileReader();
      
      reader.onload = () => {
        // Cuando la imagen se carga, se guarda en formato base64
        this.hotelForm.patchValue({
          imagen_hotel: reader.result as string
        });
      };
  
      // Leer el archivo como URL en base64
      reader.readAsDataURL(file);
    }
  }
  
}
