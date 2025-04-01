import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ServiciosAdicionales } from '../../../models/modelos';
import { ServiciosAdicionalesService } from '../../../services/servicios-adicionales.service';

@Component({
  selector: 'app-add-s',
  standalone: false,
  templateUrl: './add-s.component.html',
  styleUrl: './add-s.component.css'
})
export class AddSComponent implements OnInit {
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

  ngOnInit(): void {}

  onSubmit() {
    if (this.servicioForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    const nuevoServicio: ServiciosAdicionales = this.servicioForm.value;

    this.serviciosSrv.createServicio(nuevoServicio).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El servicio adicional se ha guardado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar el servicio adicional.'
        });
        console.error('Error guardando servicio adicional:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }
}
