import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  isLoggedIn: boolean = false;
  isClient: boolean = false;
  userType: string | null = null;

  
    constructor(private authService: Auth) {}
  
    ngOnInit(): void {
      this.authService.getCurrentUser().subscribe(user => {
        this.isLoggedIn = !!user;
        this.isClient = user?.tipo === 'cliente';
      });
  
      // Inicializar funcionalidad del mapa del sitio
      this.initSitemapNavigation();
    }
  
    initSitemapNavigation(): void {
      // Esta función se ejecutará cuando el modal se muestre
      document.getElementById('sitemapModal')?.addEventListener('shown.bs.modal', () => {
        const navButtons = document.querySelectorAll('.sitemap-nav-btn');
        
        navButtons.forEach(button => {
          button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.sitemap-section').forEach(section => {
              section.classList.remove('show');
            });
            
            // Mostrar la sección correspondiente
            const sectionId = button.getAttribute('data-section') + '-section';
            document.getElementById(sectionId)?.classList.add('show');
          });
        });
      });
    }
  
    scrollToTop(): void {
      const content = document.querySelector('.sitemap-content');
      content?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  
  shouldShowFullFooter(): boolean {
    // Show full footer if not logged in or if logged in as client
    return !this.isLoggedIn || this.isClient;
  }
}