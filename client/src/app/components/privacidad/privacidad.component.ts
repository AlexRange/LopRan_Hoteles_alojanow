import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacidad',
  standalone: false,
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.css'
})
export class PrivacidadComponent implements OnInit{
  ngOnInit(): void {
    this.checkScrollPosition();
  }

  showNavigationButtons = false;
  scrollThreshold = 200;
  showBottomButton = true;

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
