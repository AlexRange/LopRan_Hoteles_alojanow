import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular'; // Importa el AuthService de Auth0
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Provee el servicio en el módulo raíz
})
export class Auth {
  constructor(private auth0: AuthService) {} // Inyecta el AuthService de Auth0

  // Método para iniciar sesión
  login(): void {
    this.auth0.loginWithRedirect();
  }

  // Método para cerrar sesión
  logout(): void {
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated$(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  // Método para obtener el perfil del usuario
  getUser$(): Observable<any> {
    return this.auth0.user$;
  }
}
