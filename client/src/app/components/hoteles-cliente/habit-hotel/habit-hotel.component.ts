import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../../services/habitaciones.service';
import { HotelesService } from '../../../services/hoteles.service';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-habit-hotel',
  standalone: false,
  templateUrl: './habit-hotel.component.html',
  styleUrls: ['./habit-hotel.component.css']
})
export class HabitHotelComponent implements OnInit {

  hoteles: any[] = [];
  id_hotel!: number;
  hotelNombre: string = '';
  habitaciones: any[] = [];
  habitacionSeleccionada: any = null; // Almacena la habitación seleccionada para el modal

  constructor(
    private route: ActivatedRoute,
    private HabitSrv: HabitacionesService,
    private HotelSrv: HotelesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idParam = params['id_hotel'];
      
      if (idParam) {
        this.id_hotel = Number(idParam); // Convertir a número
        if (!isNaN(this.id_hotel)) {
          this.cargarHabitaciones();
          this.cargarHotel();
        } else {
          console.error('Error: id_hotel no es un número válido');
        }
      }
    });
  }

  cargarHabitaciones(): void {
    this.HabitSrv.getHabitacionesByHotel(this.id_hotel).subscribe({
      next: (habitaciones) => {
        console.log('Habitaciones cargadas:', habitaciones);
        this.habitaciones = habitaciones;
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
      }
    });
  }

  cargarHotel(): void {
    this.HotelSrv.getHotel().subscribe({
      next: (hoteles) => {
        const hotelEncontrado = hoteles.find(hotel => hotel.id_hotel === this.id_hotel);
        if (hotelEncontrado) {
          this.hotelNombre = hotelEncontrado.nombre;
        } else {
          console.warn('No se encontró el hotel con el ID:', this.id_hotel);
        }
      },
      error: (err) => {
        console.error('Error al cargar hoteles:', err);
      }
    });
  }

  abrirModal(habitacion: any): void {
    this.habitacionSeleccionada = habitacion;
    let modalElement = document.getElementById('reservacionModal');
    
    if (modalElement) {
      let modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('No se encontró el elemento del modal en el DOM.');
    }
  }
}
