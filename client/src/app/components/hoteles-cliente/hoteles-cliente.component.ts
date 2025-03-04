import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../services/hoteles.service';

@Component({
  selector: 'app-hoteles-cliente',
  standalone: false,
  templateUrl: './hoteles-cliente.component.html',
  styleUrls: ['./hoteles-cliente.component.css']
})
export class HotelesClienteComponent implements OnInit {
  hoteles: any[] = []; // Todos los hoteles
  hotelesFiltrados: any[] = []; // Hoteles filtrados por estrellas
  filtroEstrellas: number = 0; // Almacena el número de estrellas seleccionadas

  constructor(private hotelService: HotelesService) {}

  ngOnInit(): void {
    this.obtenerHoteles();
  }

  obtenerHoteles(): void {
    this.hotelService.getHotel().subscribe(
      (data) => {
        this.hoteles = data;
        this.hotelesFiltrados = data; // Inicialmente mostramos todos los hoteles
      },
      (error) => {
        console.error('Error al obtener los hoteles', error);
      }
    );
  }

  // Método que filtra los hoteles por estrellas
  filtrarHotelesPorEstrellas(): void {
    if (this.filtroEstrellas > 0) {
      this.hotelesFiltrados = this.hoteles.filter(hotel => Number(hotel.estrellas) === Number(this.filtroEstrellas));
    } else {
      this.hotelesFiltrados = [...this.hoteles]; // Si no hay filtro, mostrar todos los hoteles
    }
  }

  resetearFiltro(): void {
    this.filtroEstrellas = 0; // Restablece el filtro
    this.hotelesFiltrados = [...this.hoteles]; // Muestra todos los hoteles nuevamente
  }
  
}
