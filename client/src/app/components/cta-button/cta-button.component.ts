import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cta-button',
  standalone: false,
  templateUrl: './cta-button.component.html',
  styleUrls: ['./cta-button.component.css']
})
export class CtaButtonComponent {
  constructor(private router: Router) {}

  navigateToReservation() {
    // Cambia '/reservar' por la ruta que desees
    this.router.navigate(['/hoteles/4']);
    
    // Alternativa: usar un modal en lugar de navegación
  }

 
}