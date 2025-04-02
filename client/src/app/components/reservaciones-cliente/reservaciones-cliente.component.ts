import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Reservaciones } from '../../models/modelos';
import { Auth } from '../../services/auth.service';
import { ReservacionesService } from '../../services/reservaciones.service';

@Component({
  selector: 'app-reservaciones-cliente',
  standalone: false,
  templateUrl: './reservaciones-cliente.component.html',
  styleUrl: './reservaciones-cliente.component.css'
})
export class ReservacionesClienteComponent implements OnInit, OnChanges {
  @Input() habitacion: any;
  reservacionForm: FormGroup;
  precioHabitacion: number = 0;
  numNoches: number = 0;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reservaSrv: ReservacionesService,
    private authService: Auth
  ) {
    this.reservacionForm = this.fb.group({
      id_habitacion: ['', Validators.required],
      id_usuario: ['', Validators.required],
      id_hotel: ['', Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      precio_total: ['', Validators.required],
      estado: ['Pendiente', Validators.required],
      fecha_reservacion: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.reservacionForm.patchValue({
        id_usuario: currentUser.id_usuario
      });
    }

    if (this.habitacion) {
      this.loadHabitacionData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['habitacion'] && this.habitacion) {
      this.loadHabitacionData();
    }
  }

  loadHabitacionData(): void {
    this.reservacionForm.patchValue({
      id_habitacion: this.habitacion.id_habitacion,
      id_hotel: this.habitacion.id_hotel // Asignamos el id_hotel de la habitación
    });

    this.precioHabitacion = this.habitacion.precio_noche;
    this.calcularPrecioTotal();
  }

  onFechaChange(): void {
    if (this.reservacionForm.value.fecha_inicio && this.reservacionForm.value.fecha_fin) {
      const inicio = new Date(this.reservacionForm.value.fecha_inicio);
      const fin = new Date(this.reservacionForm.value.fecha_fin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      this.numNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.calcularPrecioTotal();
    }
  }

  calcularPrecioTotal(): void {
    const precioTotal = this.precioHabitacion * this.numNoches;
    this.reservacionForm.patchValue({
      precio_total: precioTotal
    });
  }

  onSubmit() {
    if (!this.authService.getCurrentUserValue()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes iniciar sesión para realizar una reservación.'
      });
      return;
    }

    if (this.reservacionForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }

    if (this.numNoches <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La fecha de fin debe ser posterior a la fecha de inicio.'
      });
      return;
    }

    this.loading = true;

    const reservacion: Reservaciones = {
      ...this.reservacionForm.value,
    };

    this.reservaSrv.saveReservacion(reservacion).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La reservación se ha guardado correctamente.'
        });
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        let errorMessage = 'Hubo un problema al guardar la reservación.';

        if (error?.error?.error === 'Duplicate entry detected') {
          errorMessage = 'Ya existe una reservación con esos datos.';
        } else if (error?.status === 400) {
          errorMessage = 'Los datos ingresados son incorrectos.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage
        });

        console.error('Error guardando reservación:', error);
      }
    });
  }

  resetForm(): void {
    this.reservacionForm.reset({
      estado: 'Pendiente',
      fecha_reservacion: new Date()
    });
    this.numNoches = 0;
    
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser) {
      this.reservacionForm.patchValue({
        id_usuario: currentUser.id_usuario
      });
    }
    
    if (this.habitacion) {
      this.reservacionForm.patchValue({
        id_habitacion: this.habitacion.id_habitacion,
        id_hotel: this.habitacion.id_hotel // También restablecemos el id_hotel al resetear
      });
    }
  }
}