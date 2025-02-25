import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Hoteles, Promociones } from '../../../models/modelos';
import { HotelesService } from '../../../services/hoteles.service';
import { PromocionesService } from '../../../services/promociones.service';

@Component({
  selector: 'app-add-p',
  standalone: false,
  templateUrl: './add-p.component.html',
  styleUrl: './add-p.component.css'
})
export class AddPComponent implements OnInit {
  promocionForm: FormGroup;
  hotelesget: Hoteles[] = [];

  constructor(
    private fb: FormBuilder,
    private modal: NgbActiveModal,
    private hotelSrv: HotelesService,
    private promocionSrv: PromocionesService
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
    this.hotelSrv.getHotel().subscribe(
      res => {
        this.hotelesget = res;
      },
      err => console.error('Error fetching hoteles:', err)
    );
  }

  onSubmit() {
    if (this.promocionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    const promocion: Promociones = {
      ...this.promocionForm.value,
    };

    console.log('Enviando datos al backend:', promocion);

    this.promocionSrv.savePromocion(promocion).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La promocion se ha guardado correctamente.'
        }).then(() => {
          this.close();
        });
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al guardar la promocion.'
        });
        console.error('Error guardando promocion:', error);
      }
    );
  }

  close() {
    this.modal.dismiss();
  }
}
