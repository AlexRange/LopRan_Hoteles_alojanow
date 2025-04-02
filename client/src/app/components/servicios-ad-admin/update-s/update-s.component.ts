import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiciosAdicionales } from '../../../models/modelos';
import { ServiciosAdicionalesService } from '../../../services/servicios-adicionales.service';

@Component({
  selector: 'app-update-s',
  standalone: false,
  templateUrl: './update-s.component.html',
  styleUrl: './update-s.component.css'
})
export class UpdateSComponent implements OnInit {
  @Input() prop?: ServiciosAdicionales;

  servicioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private serviciosSrv: ServiciosAdicionalesService
  ) {
    this.servicioForm = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      descripcion: [null, [Validators.required, Validators.minLength(1)]],
      precio: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.prop) {
      this.servicioForm.patchValue({
        nombre: this.prop.nombre,
        descripcion: this.prop.descripcion,
        precio: this.prop.precio
      });
    }
  }

  onSubmit() {
    if (this.servicioForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        width: '300px'
      });
      return;
    }

    if (!this.prop || this.prop.id_servicio === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El servicio adicional no está definido.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        width: '300px'
      });
      return;
    }

    const updatedServicio: ServiciosAdicionales = {
      ...this.prop,
      ...this.servicioForm.value
    };

    this.serviciosSrv.updateServicio(this.prop.id_servicio, updatedServicio).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Servicio actualizado correctamente.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          width: '300px'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el servicio adicional.',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          width: '300px'
        });
        console.error('Error actualizando servicio adicional:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }
}
