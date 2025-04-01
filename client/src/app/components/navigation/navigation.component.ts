import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
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
        this.authService.validateToken().subscribe(isValid => {
          if (!isValid) {
            this.handleInvalidSession();
          }
        });
      }
    });

    this.checkCurrentRoute(this.router.url);
  }

  private handleInvalidSession(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.authService.clearAuthData();
    this.router.navigate(['/login']);
  }

  checkCurrentRoute(url: string): void {
    this.isLoginPage = url.includes('/login');
    this.isProfilePage = url.includes('/mi-perfil');
  }

  onInputChange(): void {
    if (this.searchQuery.length > 2) {
      this.searchResults = [];
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
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}