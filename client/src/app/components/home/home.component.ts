import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  showNavigationButtons = false;
  scrollThreshold = 200;
  showBottomButton = true;

  recommendedPlaces = [
    { name: "Apartamento en Madrid", description: "Centro de la ciudad, cerca de todo", price: "$80/noche", image: "assets/madrid.jpg" },
    { name: "Cabaña en Canadá", description: "Naturaleza y tranquilidad", price: "$120/noche", image: "assets/canada.jpg" },
    { name: "Villa en Bali", description: "Privacidad y lujo en la playa", price: "$250/noche", image: "assets/bali.jpg" }
  ];

  ngOnInit() {
    this.checkScrollPosition();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScrollPosition();
    this.checkBottomPosition();
  }

  checkBottomPosition() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    const scrollPosition = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    // Mostrar el botón de bajar solo si no estamos cerca del final (con un margen de 100px)
    this.showBottomButton = !(scrollPosition + windowHeight >= documentHeight - 100);
  }

  checkScrollPosition() {
    this.showNavigationButtons = window.pageYOffset > this.scrollThreshold;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
    this.showBottomButton = false;
    setTimeout(() => {
      this.checkBottomPosition();
    }, 1000);
  }
}