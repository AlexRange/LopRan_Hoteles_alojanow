import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuarios } from './models/modelos';
import { Auth } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  currentUser: Usuarios | null = null;
  private userSubscription: Subscription;

  constructor(private authService: Auth) {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // Inicializar con el usuario actual si existe
    this.currentUser = this.authService.getCurrentUserValue();
  }

  ngOnDestroy() {
    // Limpiar la suscripción para evitar memory leaks
    this.userSubscription.unsubscribe();
  }

  get isAdmin(): boolean {
    return this.currentUser?.tipo === 'admin';
  }
}