import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
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
          descripcion: ['', Validators.required],
          capacidad: ['', [Validators.required, Validators.min(1)]],
          precio_noche: ['', [Validators.required]],
          disponibilidad: [true, Validators.required],
          imagen_habitacion: ['', Validators.required],
          descripcion_imagen_hab: ['', Validators.required],
        });
  }

  ngOnInit(): void {
    if (this.prop) {
      // Asigna los valores a los campos del formulario
      this.habitacionForm.patchValue({
        id_hotel: this.prop.id_hotel,
        tipo_habitacion: this.prop.tipo_habitacion,
        descripcion: this.prop.descripcion,
        capacidad: this.prop.capacidad,
        precio_noche: this.prop.precio_noche,
        Disponibilidad: this.prop.disponibilidad,
        descripcion_imagen_habitacion: this.prop.imagen_habitacion,
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
      return;
    }

    if (!this.prop || this.prop.id_habitacion === undefined) {
      console.error('Habitacion ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La habitacion no está definida.'
      });
      return;
    }

    // Obtener los valores actualizados del formulario
    const updatedHabitacion: Habitaciones = {
      ...this.prop,
      ...this.habitacionForm.value
    };
    console.log("Datos recibidos para actualizar:", updatedHabitacion);

    this.habitacionesSrv.updateHabitacion(this.prop.id_habitacion, updatedHabitacion).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La habitacion se ha actualizado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la habitacion.'
        });
        console.error('Error updating habitacion:', error);
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
        this.habitacionForm.patchValue({
          imagen_habitacion: reader.result as string
        });
      };
  
      // Leer el archivo como URL en base64
      reader.readAsDataURL(file);
    }
  }
}
