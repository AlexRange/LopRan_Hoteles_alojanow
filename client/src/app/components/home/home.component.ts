import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HotelesService } from '../../services/hoteles.service';
import { Auth } from '../../services/auth.service';
import { Hoteles } from '../../models/modelos'; // Importamos la interfaz Hoteles

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredHotels: Hoteles[] = []; // Hoteles destacados (cards horizontales)
  recommendedHotels: Hoteles[] = []; // Hoteles recomendados (cards verticales)
  searchResults: Hoteles[] = []; // Resultados de búsqueda
  showSearchResults: boolean = false;
  usuarioId: number | null = null;

  // Filtros de búsqueda
  searchDestination: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  guests: string = '2';

  // Filtros por zona (actualizados para coincidir con la propiedad 'zona' de Hoteles)
  zoneFilters = [
    { type: 'playa', name: 'Playa', icon: 'fas fa-umbrella-beach' },
    { type: 'montaña', name: 'Montaña', icon: 'fas fa-mountain' },
    { type: 'ciudad', name: 'Ciudad', icon: 'fas fa-city' },
    { type: 'campo', name: 'Campo', icon: 'fas fa-tractor' },
    { type: 'bosque', name: 'Bosque', icon: 'fas fa-tree' },
    { type: 'lago', name: 'Lago', icon: 'fas fa-water' },
    { type: 'lujo', name: 'Lujo', icon: 'fas fa-crown' },
    { type: 'económico', name: 'Económico', icon: 'fas fa-wallet' }
  ];

  constructor(
    private hotelService: HotelesService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.loadFeaturedHotels();
    this.loadRecommendedHotels();
    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.usuarioId = user.id_usuario;
      }
    });
  }

  private loadFeaturedHotels(): void {
    this.hotelService.getHotel().subscribe({
      next: (hoteles: Hoteles[]) => {
        // Ordenamos por estrellas y tomamos los primeros 3 como destacados
        this.featuredHotels = [...hoteles]
          .sort((a, b) => b.estrellas - a.estrellas)
          .slice(0, 3);
      },
      error: (error) => this.handleError('Error al cargar hoteles destacados', error)
    });
  }

  private loadRecommendedHotels(): void {
    this.hotelService.getHotel().subscribe({
      next: (hoteles: Hoteles[]) => {
        // Filtramos hoteles con 4+ estrellas y tomamos 4 aleatorios como recomendados
        const highRated = hoteles.filter(h => h.estrellas >= 4);
        this.recommendedHotels = this.shuffleArray(highRated).slice(0, 4);
      },
      error: (error) => this.handleError('Error al cargar hoteles recomendados', error)
    });
  }

  private shuffleArray(array: any[]): any[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    
    if (!this.searchDestination.trim()) {
      Swal.fire('Información', 'Por favor ingresa un destino para buscar', 'info');
      return;
    }

    this.hotelService.buscarHoteles(this.searchDestination).subscribe({
      next: (hoteles: Hoteles[]) => {
        this.searchResults = hoteles;
        this.showSearchResults = hoteles.length > 0;
        
        if (hoteles.length === 0) {
          Swal.fire('Información', 'No se encontraron hoteles para tu búsqueda', 'info');
        }
      },
      error: (error) => this.handleError('Error en la búsqueda de hoteles', error)
    });
  }

  filterByZone(zoneType: string): void {
    this.hotelService.getHotel().subscribe({
      next: (hoteles: Hoteles[]) => {
        // Normalizamos la búsqueda (a minúsculas y sin acentos)
        const normalizedSearch = this.normalizeString(zoneType);
        
        this.recommendedHotels = hoteles.filter(hotel => {
          if (!hotel.zona) return false;
          
          const normalizedHotelZone = this.normalizeString(hotel.zona);
          return normalizedHotelZone.includes(normalizedSearch);
        });
  
        if (this.recommendedHotels.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No hay hoteles disponibles',
            text: `No encontramos hoteles en la zona ${zoneType}`,
            timer: 3000
          });
          this.loadRecommendedHotels(); // Recargamos las recomendaciones originales
        }
      },
      error: (error) => {
        console.error('Error al filtrar hoteles:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudimos cargar los hoteles. Por favor intenta nuevamente.',
          timer: 3000
        });
      }
    });
  }
  
  // Método auxiliar para normalizar strings
  private normalizeString(str: string): string {
    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  private handleError(title: string, error: any): void {
    console.error(title, error);
    Swal.fire('Error', title, 'error');
  }

  // Método auxiliar para obtener el precio mínimo de un hotel
  getStartingPrice(hotel: Hoteles): number {
    // En una implementación real, esto debería venir del servicio
    // o buscar el mínimo precio entre las habitaciones
    return 100; // Valor temporal - deberías implementar la lógica real
  }
}