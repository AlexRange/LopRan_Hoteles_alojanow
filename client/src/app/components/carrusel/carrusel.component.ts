import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carrusel',
  standalone: false,
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {
 items: any[] = [
    {
      image: 'https://eproint.com/wp-content/uploads/2023/12/IP-in-The-Bahamas-WEB-Without-Text_11zon-1024x594.webp',
      title: 'BAHAMAS',
      name: 'U.S.A',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'
    },
    {
      image: 'https://www.sundes.com/uploads/001ImagenesNuevas//grecia.webp',
      title: 'GRECIA',
      name: 'Europa',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'
    },
    {
      image: 'https://www.agenciadinamita.com/wp-content/uploads/2022/08/marketing-digital-cancun.webp',
      title: 'CANCUN',
      name: 'Mexico',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'
    },
    {
      image: 'https://www.conecty.co/cdn/shop/articles/banner-viajar-japon.webp?v=1727277853',
      title: 'JAPON',
      name: 'Asia',
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'
    },
    // Añade m
    // ás elementos aquí...
  ];
  timeRunning: number = 4000; // Duración de la animación
  timeAutoNext: number = 16000; // Tiempo para el siguiente slide automático
  runTimeOut: any;
  runNextAuto: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.runNextAuto = setTimeout(() => {
        this.showSlider('next');
      }, this.timeAutoNext);
    }
  }
  showSlider(type: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const list = document.querySelector('.list') as HTMLElement;
      const sliderItems = list.querySelectorAll('.item');

      if (type === 'next') {
        list.appendChild(sliderItems[0]);
      } else {
        list.prepend(sliderItems[sliderItems.length - 1]);
      }

      clearTimeout(this.runTimeOut);
      this.runTimeOut = setTimeout(() => {
        list.classList.remove('next');
        list.classList.remove('prev');
      }, this.timeRunning);

      clearTimeout(this.runNextAuto);
      this.runNextAuto = setTimeout(() => {
        this.showSlider('next');
      }, this.timeAutoNext);

      this.resetTimeAnimation();
    }
  }

  resetTimeAnimation(): void {
    if (isPlatformBrowser(this.platformId)) {
      const runningTime = document.querySelector('.timeRunning') as HTMLElement;
      runningTime.style.animation = 'none';
      runningTime.offsetHeight; // Trigger reflow
      runningTime.style.animation = ''; // Usa una cadena vacía en lugar de null
      runningTime.style.animation = 'runningTime 9s linear 1 forwards';
    }
  }
}
