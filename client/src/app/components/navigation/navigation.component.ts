import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Usuarios } from '../../models/modelos';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  standalone: false,
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  searchQuery: string = '';
  searchResults: { text: string, link: string }[] = [];
  showResults: boolean = false;
  currentUser: Usuarios | null = null;
  isAuthenticated = false;
  isLoginPage: boolean = false;
  isProfilePage: boolean = false;
  menuOpen = false;
  dropdownsOpen: {[key: string]: boolean} = {};

  constructor(private router: Router, private authService: Auth) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkCurrentRoute(event.url);
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      
      if (this.isAuthenticated) {
        this.authService.validateToken().subscribe({
          next: (isValid) => {
            if (!isValid) {
              this.handleInvalidSession();
            }
          },
          error: () => {
            this.handleInvalidSession();
          }
        });
      }
    });

    this.checkCurrentRoute(this.router.url);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown(dropdownId: string) {
    if (window.innerWidth <= 768) {
      this.dropdownsOpen[dropdownId] = !this.dropdownsOpen[dropdownId];
    }
  }

  isDropdownOpen(dropdownId: string): boolean {
    return window.innerWidth <= 768 ? this.dropdownsOpen[dropdownId] : false;
  }

  private handleInvalidSession(): void {
    Swal.fire({
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
      this.isAuthenticated = false;
      this.currentUser = null;
      this.authService.clearAuthData();
      this.router.navigate(['/login']);
    });
  }

  checkCurrentRoute(url: string): void {
    this.isLoginPage = url.includes('/login');
    this.isProfilePage = url.includes('/mi-perfil');
  }

  onInputChange(): void {
    if (this.searchQuery.length > 2) {
      this.searchResults = [];
      this.showResults = false;
      const normalizedQuery = this.searchQuery.toLowerCase().trim();
      const routes = this.getDynamicRoutes();

      routes.forEach(route => {
        if (!route.toLowerCase().includes('admin')) {
          const linkElement = document.querySelector(`a[href="${route}"]`);
          if (linkElement) {
            const linkText = linkElement.textContent?.trim() || '';
            if (linkText.toLowerCase().includes(normalizedQuery)) {
              this.searchResults.push({ text: linkText, link: route });
            }
          }
        }
      });
      this.showResults = this.searchResults.length > 0;
    } else {
      this.showResults = false;
    }
  }

  getDynamicRoutes(): string[] {
    const routes: string[] = [];
    this.router.config.forEach(route => {
      if (route.path) {
        routes.push(`/${route.path}`);
      }
      if (route.children) {
        route.children.forEach(childRoute => {
          if (childRoute.path) {
            routes.push(`/${route.path}/${childRoute.path}`);
          }
        });
      }
    });
    return routes;
  }

  navigateTo(result: { text: string, link: string }): void {
    this.router.navigateByUrl(result.link);
    this.showResults = false;
    this.searchQuery = '';
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchResults.length > 0) {
      this.navigateTo(this.searchResults[0]);
    }
  }

  logout(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: () => {
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Has cerrado sesión correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home']);
            });
          },
          error: (err) => {
            console.error('Error al cerrar sesión:', err);
            Swal.fire({
              title: 'Sesión cerrada',
              text: 'Se cerró la sesión localmente',
              icon: 'info',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/home']);
            });
          }
        });
      }
    });
  }
}