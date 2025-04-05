import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Hoteles, Promociones } from '../../../models/modelos';
import { HotelesService } from '../../../services/hoteles.service';
import { PromocionesService } from '../../../services/promociones.service';

@Component({
  selector: 'app-update-p',
  standalone: true,
  imports:[ReactiveFormsModule],
  templateUrl: './update-p.component.html',
  styleUrl: './update-p.component.css'
})
export class UpdatePComponent implements OnInit {
  @Input() prop?: Promociones;

  promocionForm: FormGroup;

  hotelesget: Hoteles[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private hotelesSrv: HotelesService,
    private promSrv: PromocionesService
  ) {
    this.promocionForm = this.fb.group({
          id_hotel: ['', Validators.required],
          descripcion: ['', Validators.required],
          descuento: ['', Validators.required],
          fecha_inicio: ['', Validators.required],
          fecha_fin: ['', Validators.required],
        });
  }

  ngOnInit(): void {
    if (this.prop) {
      // Asigna los valores a los campos del formulario
      this.promocionForm.patchValue({
        id_hotel: this.prop.id_hotel,
        descripcion: this.prop.descripcion,
        descuento: this.prop.descuento,
        fecha_inicio: this.prop.fecha_inicio,
        fecha_fin: this.prop.fecha_fin
      });
    }

    this.hotelesSrv.getHotel().subscribe(
      res => {
        this.hotelesget = res;
      },
      err => console.error('Error fetching hoteles:', err)
    );
  }

  onSubmit() {
    if (this.promocionForm.invalid) {
      return;
    }

    if (!this.prop || this.prop.id_promocion === undefined) {
      console.error('Promocion ID is undefined');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La promocion no está definida.'
      });
      return;
    }

    // Obtener los valores actualizados del formulario
    const updatedProm: Promociones = {
      ...this.prop,
      ...this.promocionForm.value
    };

    this.promSrv.updatePromoxion(this.prop.id_promocion, updatedProm).subscribe(
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
}
