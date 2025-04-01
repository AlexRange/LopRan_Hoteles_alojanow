import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Reservaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getReservaciones(): Observable<Reservaciones[]> {
    return this.http.get<Reservaciones[]>(`${this.apiUrl}/reservaciones`).pipe(
      catchError(error => {
        console.error('Error retrieving reservations:', error);
        return throwError(() => new Error('Error retrieving reservations'));
      })
    );
  }

  getReservacion(id_reservacion: string | number): Observable<Reservaciones> {
    return this.http.get<Reservaciones>(`${this.apiUrl}/reservaciones/${id_reservacion}`).pipe(
      catchError(error => {
        console.error('Error retrieving reservation:', error);
        return throwError(() => new Error('Error retrieving reservation'));
      })
    );
  }

  getReservacionesByIdUsuario(id_usuario: string | number): Observable<Reservaciones[]> {
    return this.http.get<any>(`${this.apiUrl}/reservaciones/usuario/${id_usuario}`).pipe(
      map(response => {
        // Si la respuesta es un array, devuélvelo directamente
        if (Array.isArray(response)) {
          return response;
        }
        // Si la respuesta es un objeto de reservación individual, envuélvelo en un array
        else if (response && response.id_reservacion) {
          return [response];
        }
        // Si no es ninguno de los casos anteriores, devuelve array vacío
        return [];
      }),
      catchError(error => {
        console.error('Error retrieving user reservations:', error);
        return throwError(() => new Error('Error retrieving user reservations'));
      })
    );
  }

  saveReservacion(reservacion: Reservaciones): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservaciones`, reservacion).pipe(
      catchError(error => {
        console.error('Error saving reservation:', error);

        let errorMessage = 'Error saving reservation';
        if (error.status === 500) {
          if (error.error.error === 'Duplicate entry detected') {
            errorMessage = 'Esta reservación ya existe';
          } else if (error.error.error === 'Invalid field in request body') {
            errorMessage = 'Datos de reservación inválidos';
          }
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // En reservaciones.service.ts
  updateReservacion(id_reservacion: string | number, update: Partial<Reservaciones>): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservaciones/${id_reservacion}`, update).pipe(
      catchError(error => {
        console.error('Error updating reservation:', error);
        return throwError(() => new Error('Error updating reservation'));
      })
    );
  }

  deleteReservacion(id_reservacion: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservaciones/${id_reservacion}`).pipe(
      catchError(error => {
        console.error('Error deleting reservation:', error);
        return throwError(() => new Error('Error deleting reservation'));
      })
    );
  }
}