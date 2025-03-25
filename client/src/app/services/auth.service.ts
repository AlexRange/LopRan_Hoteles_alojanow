import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Usuarios } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUserSubject: BehaviorSubject<Usuarios | null>;
  public currentUser$: Observable<Usuarios | null>;
  private apiUrl = 'http://localhost:4000/api'; // Ajusta según tu configuración

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuarios | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Método para establecer el estado de autenticación
  setLoggedInStatus(status: boolean): void {
    if (!status) {
      this.clearAuthData();
    }
    // No hacemos nada si es true, porque solo debe establecerse mediante setCurrentUser
  }

  // Método para iniciar sesión (solo verifica credenciales, NO establece sesión)
  loginToServer(email: string, contrasena: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, contrasena }).pipe(
      catchError(error => {
        this.showErrorToast('Error al iniciar sesión');
        return throwError(() => error);
      })
    );
  }

  // Método para establecer el usuario actual y completar el inicio de sesión
  setCurrentUser(user: Usuarios): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.setLoggedInStatus(true);
    this.showSuccessToast('Inicio de sesión exitoso');
  }

  // Método para cerrar sesión
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
    this.showSuccessToast('Sesión cerrada correctamente');
  }

  // Método para verificar estado de autenticación
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  // Método para obtener el usuario actual (síncrono)
  getCurrentUserValue(): Usuarios | null {
    return this.currentUserSubject.value;
  }

  // Método para obtener el observable del usuario
  getCurrentUser(): Observable<Usuarios | null> {
    return this.currentUser$;
  }

  // Limpiar datos de autenticación
  private clearAuthData(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Mostrar notificación de éxito
  private showSuccessToast(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  // Mostrar notificación de error
  private showErrorToast(message: string): void {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: message,
      showConfirmButton: false,
      timer: 2000
    });
  }

  updateUser(userData: Partial<Usuarios>): Observable<Usuarios> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      return throwError(() => new Error('No user logged in'));
    }
  
    return this.http.put<Usuarios>(`${this.apiUrl}/usuarios/${currentUser.id_usuario}`, userData).pipe(
      tap(updatedUser => {
        this.setCurrentUser(updatedUser);
        this.showSuccessToast('Datos actualizados correctamente');
      }),
      catchError(error => {
        this.showErrorToast('Error al actualizar los datos');
        return throwError(() => error);
      })
    );
  }
}