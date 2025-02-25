import { Component } from '@angular/core';
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

  constructor(public auth: AuthService) {
    // Obtener datos del usuario autenticado
    this.auth.user$.subscribe(user => {
      this.userPicture = user?.picture || 'assets/default-avatar.png';
      this.userName = user?.name || 'Usuario';
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

}
