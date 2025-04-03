import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Usuarios } from '../../models/modelos';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-navigation-admin',
  templateUrl: './navigation-admin.component.html',
  standalone: false,
  styleUrls: ['./navigation-admin.component.css']
})
export class NavigationAdminComponent implements OnInit {
  searchQuery: string = '';
  searchResults: { text: string, link: string }[] = [];
  showResults: boolean = false;
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<Usuarios | null>;
  isLoggedIn: boolean = false;
  isLoginPage: boolean = false;
  isProfilePage: boolean = false;

  constructor(private router: Router, private authService: Auth) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.currentUser$ = this.authService.getCurrentUser();
    
    // Suscribirse a los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkCurrentRoute(event.url);
    });
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      // Verificar ruta actual al cambiar autenticación
      this.checkCurrentRoute(this.router.url);
    });
    this.checkCurrentRoute(this.router.url);
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
        if (route.toLowerCase().includes('admin')) {
          return;
        }

        const linkElement = document.querySelector(`a[href="${route}"]`);
        if (linkElement) {
          const linkText = linkElement.textContent?.trim() || '';
          if (linkText.toLowerCase().includes(normalizedQuery)) {
            this.searchResults.push({ text: linkText, link: route });
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