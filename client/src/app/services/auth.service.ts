import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuarios } from '../models/modelos';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Auth implements OnDestroy {
  private currentUserSubject: BehaviorSubject<Usuarios | null>;
  public currentUser$: Observable<Usuarios | null>;
  private apiUrl = 'https://localhost:4000/api';
  private tokenExpirationTimer: any;
  private tempAuthData: { email: string, contrasena: string, userData?: any, token?: string } | null = null;

  private warningTimeout = 3 * 60 * 1000; // 3 minutos para mostrar alerta
  private gracePeriod = 2 * 60 * 1000; // 2 minutos más para cerrar sesión si no hay respuesta
  private inactivityTimer: any;
  private warningTimer: any;
  private activityEvents = ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'];

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<Usuarios | null>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.setupInactivityListener();
  }

  private getStoredUser(): Usuarios | null {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');
      return storedUser && storedToken ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error parsing stored user data', e);
      this.clearAuthData();
      return null;
    }
  }

  private setupInactivityListener(): void {
    this.resetInactivityTimers();
    this.activityEvents.forEach(event => {
      window.addEventListener(event, this.resetInactivityTimersBound);
    });
  }

  private resetInactivityTimersBound = this.resetInactivityTimers.bind(this);

  private resetInactivityTimers(): void {
    if (!this.getCurrentUserValue()) return;

    clearTimeout(this.inactivityTimer);
    clearTimeout(this.warningTimer);
    Swal.close();

    this.warningTimer = setTimeout(() => this.showInactivityWarning(), this.warningTimeout);
  }

  private showInactivityWarning(): void {
    Swal.fire({
      title: 'Sesión por expirar',
      text: 'Tu sesión está a punto de expirar por inactividad. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Extender sesión',
      cancelButtonText: 'Cerrar sesión',
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: this.gracePeriod,
      timerProgressBar: true,
      didOpen: () => {
        // El usuario tiene graciaPeriod para contestar
        this.inactivityTimer = setTimeout(() => this.logoutDueToInactivity(), this.gracePeriod);
      },
      willClose: () => {
        clearTimeout(this.inactivityTimer);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetInactivityTimers();
      } else if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.timer) {
        this.logoutDueToInactivity();
      }
    });
  }

  private logoutDueToInactivity(): void {
    this.logout().subscribe({
      next: () => {
        this.router.navigate(['/login'], {
          queryParams: { sessionExpired: true }
        });
      },
      error: (err) => {
        console.error('Error al cerrar sesión por inactividad:', err);
        this.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }

  setAuth(user: Usuarios, token: string): void {
    if (!user || !token) {
      console.error('Intento de autenticación con datos inválidos');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.currentUserSubject.next(user);

    try {
      const decodedToken = this.decodeToken(token);
      if (decodedToken?.exp) {
        const expiresIn = decodedToken.exp * 1000 - Date.now();
        this.setLogoutTimer(expiresIn);
      }
    } catch (e) {
      console.error('Error al decodificar token:', e);
      this.clearAuthData();
    }

    this.resetInactivityTimers();
  }

  loginToServer(email: string, contrasena: string): Observable<{ success: boolean, usuario?: Usuarios, token?: string, message?: string }> {
    return this.http.post<{ success: boolean, usuario: Usuarios, token: string }>(
      `${this.apiUrl}/login`,
      { email, contrasena }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.tempAuthData = { email, contrasena, userData: response.usuario, token: response.token };
        }
      }),
      catchError(this.handleError)
    );
  }

  completeLogin(): void {
    if (this.tempAuthData?.userData && this.tempAuthData.token) {
      this.setAuth(this.tempAuthData.userData, this.tempAuthData.token);
      this.tempAuthData = null;
    }
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});

    return this.http.post(`${this.apiUrl}/login/logout`, {}, { headers }).pipe(
      tap(() => this.cleanupAfterLogout()),
      catchError(error => {
        this.cleanupAfterLogout();
        return throwError(() => error);
      })
    );
  }

  private cleanupAfterLogout(): void {
    this.clearAuthData();
    this.clearTempAuthData();
    this.router.navigate(['/home']);
  }

  public clearAuthData(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    clearTimeout(this.tokenExpirationTimer);
    clearTimeout(this.inactivityTimer);
    clearTimeout(this.warningTimer);
    Swal.close();
  }

  private clearTempAuthData(): void {
    this.tempAuthData = null;
  }

  private setLogoutTimer(expirationDuration: number): void {
    clearTimeout(this.tokenExpirationTimer);
    this.tokenExpirationTimer = setTimeout(() => this.logout().subscribe(), expirationDuration);
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/login/validate-token`, { headers }).pipe(
      map(response => {
        if (response.valid) {
          const decodedToken = this.decodeToken(token);
          if (decodedToken?.exp) {
            this.setLogoutTimer(decodedToken.exp * 1000 - Date.now());
          }
          return true;
        }
        this.clearAuthData();
        return false;
      }),
      catchError(error => {
        console.error('Error validating token:', error);
        this.clearAuthData();
        return of(false);
      })
    );
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (e) {
      console.error('Error getting token:', e);
      return null;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.getToken() ? this.validateToken() : of(false);
  }

  getCurrentUserValue(): Usuarios | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): Observable<Usuarios | null> {
    return this.currentUser$;
  }

  updateUser(userData: Partial<Usuarios>): Observable<Usuarios> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return throwError(() => new Error('No user logged in'));

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    return this.http.put<Usuarios>(`${this.apiUrl}/usuarios/${currentUser.id_usuario}`, userData, { headers }).pipe(
      tap(updatedUser => {
        const mergedUser = {
          ...currentUser,
          ...updatedUser,
          telefono: updatedUser.telefono !== undefined ? updatedUser.telefono : currentUser.telefono,
          imagen_usuario: updatedUser.imagen_usuario !== undefined ? updatedUser.imagen_usuario : currentUser.imagen_usuario
        };
        localStorage.setItem('currentUser', JSON.stringify(mergedUser));
        this.currentUserSubject.next(mergedUser);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }

  ngOnDestroy(): void {
    this.activityEvents.forEach(event => {
      window.removeEventListener(event, this.resetInactivityTimersBound);
    });
    this.clearAuthData();
  }
}