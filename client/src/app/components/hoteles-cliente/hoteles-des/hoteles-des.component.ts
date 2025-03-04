import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../../services/hoteles.service';

@Component({
  selector: 'app-hoteles-des',
  standalone: false,
  templateUrl: './hoteles-des.component.html',
  styleUrl: './hoteles-des.component.css'
})
export class HotelesDesComponent implements OnInit {
  hoteles: any[] = []; // Array para almacenar los hoteles obtenidos

  constructor(private hotelService: HotelesService) {}

  ngOnInit(): void {
    this.obtenerHoteles();
  }

  obtenerHoteles(): void {
    this.hotelService.getHotel().subscribe(
      (data) => {
        // Filtramos los hoteles para solo obtener los que tienen 5 estrellas
        this.hoteles = data.filter(hotel => hotel.estrellas === 5);
      },
      (error) => {
        console.error('Error al obtener los hoteles', error);
      }
    );
  }
}
