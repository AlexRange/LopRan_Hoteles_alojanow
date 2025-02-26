import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 

  recommendedPlaces = [
    { name: "Apartamento en Madrid", description: "Centro de la ciudad, cerca de todo", price: "$80/noche", image: "assets/madrid.jpg" },
    { name: "Cabaña en Canadá", description: "Naturaleza y tranquilidad", price: "$120/noche", image: "assets/canada.jpg" },
    { name: "Villa en Bali", description: "Privacidad y lujo en la playa", price: "$250/noche", image: "assets/bali.jpg" }
  ];




}
