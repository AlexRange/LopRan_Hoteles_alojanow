import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  recommendedPlaces = [
    { name: "Apartamento en Madrid", description: "Centro de la ciudad, cerca de todo", price: "$80/noche", image: "/client/src/assets/madrid.jpg" },
    { name: "Cabaña en Canadá", description: "Naturaleza y tranquilidad", price: "$120/noche", image: "assets/canada.jpg" },
    { name: "Villa en Bali", description: "Privacidad y lujo en la playa", price: "$250/noche", image: "assets/bali.jpg" }
  ];

  selectedCategory: string = '';

  places = [
    { name: 'Cancún', category: 'Playa' },
    { name: 'Valle de Bravo', category: 'Bosque' },
    { name: 'Tepoztlán', category: 'Pueblo Mágico' },
    { name: 'Nevado de Toluca', category: 'Montaña' },
    { name: 'Selva Lacandona', category: 'Ecoturismo' },
    { name: 'Tequila', category: 'Pueblo Mágico' },
    { name: 'Los Cabos', category: 'Playa' },
  ];

  get filteredPlaces() {
    return this.selectedCategory
      ? this.places.filter(place => place.category === this.selectedCategory)
      : this.places; // Si no hay filtro, mostrar todo
  }
  
  onCategorySelected(category: string) {
    this.selectedCategory = category;
  }
}
