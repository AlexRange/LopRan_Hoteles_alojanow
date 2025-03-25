import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Reservaciones } from '../models/modelos';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getReservaciones() {
    return this.http.get<Reservaciones[]>(`${this.apiUrl}/reservaciones`);
  }

  deleteReservacion(id_reservacion: string | number) {
    return this.http.delete(`${this.apiUrl}/reservaciones/${id_reservacion}`);
  }

  saveReservacion(evento: Reservaciones): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservaciones`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar la reservación:', error);
        return throwError(error); // Propaga el error para que el componente lo maneje
      })
    );
  }

  updateReservacion(id_reservacion: string | number, update: Reservaciones): Observable<Reservaciones> {
    return this.http.put<Reservaciones>(`${this.apiUrl}/reservaciones/${id_reservacion}`, update);
  }
}