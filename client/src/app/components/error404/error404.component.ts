import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-error404',
  standalone: false,
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.css'
})
export class Error404Component implements OnInit {
  usuario: any;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual
    this.usuario = this.authService.getCurrentUserValue();
  }

  // Función para obtener la ruta de inicio según el tipo de usuario
  getHomeRoute(): string {
    return this.usuario?.tipo === 'admin' ? '/home-admin' : '/home';
  }

  // Función para redirigir al inicio correcto
  redirectHome(): void {
    const route = this.getHomeRoute();
    this.router.navigate([route]);
  }
}