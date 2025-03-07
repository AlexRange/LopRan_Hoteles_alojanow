import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: false,
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {

  userPicture: string = 'assets/default-avatar.png'; // Imagen por defecto
  userName: string = 'Usuario';
  searchQuery: string = '';
  searchResults: { text: string, link?: string, id?: string }[] = [];
  showResults: boolean = false;

  constructor(public auth: AuthService, private router: Router) {
    // Obtener datos del usuario autenticado
    this.auth.user$.subscribe(user => {
      this.userPicture = user?.picture || 'assets/default-avatar.png';
      this.userName = user?.nickname || 'Usuario';
    });
  }

  // Método para iniciar sesión
  login() {
    this.auth.loginWithRedirect();
  }

  // Método para cerrar sesión
  logout() {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  // Método para manejar cambios en el input de búsqueda
  onInputChange() {
    if (this.searchQuery.length > 2) {
      this.searchResults = this.searchInDOM(this.searchQuery);
      this.showResults = this.searchResults.length > 0;
    } else {
      this.showResults = false;
    }
  }

  // Método para buscar coincidencias en el DOM
  searchInDOM(query: string): { text: string, link?: string, id?: string }[] {
    const results: { text: string, link?: string, id?: string }[] = [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a');

    elements.forEach(element => {
      const text = element.textContent?.toLowerCase();
      if (text && text.includes(query.toLowerCase())) {
        const link = element.closest('a')?.getAttribute('href');
        const id = element.getAttribute('id');
        results.push({
          text: element.textContent || '',
          link: link || undefined,
          id: id || undefined
        });
      }
    });

    return results;
  }

  // Método para navegar a la sección encontrada
  navigateTo(result: { text: string, link?: string, id?: string }) {
    if (result.link) {
      // Si hay un enlace, redirigir a la nueva página
      this.router.navigateByUrl(result.link);
    } else if (result.id) {
      // Si hay un ID, desplazarse a la sección en la página actual
      const element = document.getElementById(result.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    this.showResults = false;
    this.searchQuery = '';
  }

  // Método para manejar el envío del formulario de búsqueda
  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchResults.length > 0) {
      this.navigateTo(this.searchResults[0]);
    }
  }
}
