import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Reservaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {

  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getReservaciones() {
    return this.http.get<Reservaciones[]>(`${this.API_URI}/reservaciones`);
  }

  deleteReservacion(id_reservacion: string | number) {
    return this.http.delete(`${this.API_URI}/reservaciones/${id_reservacion}`);
  }

  saveReservacion(evento: Reservaciones): Observable<any> {
    return this.http.post(`${this.API_URI}/reservaciones`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el Service', error);
        return of(null);
      })
    );
  }

  updateReservacion(id_reservacion: string | number, update: Reservaciones): Observable<Reservaciones> {
    return this.http.put<Reservaciones>(`${this.API_URI}/reservaciones/${id_reservacion}`, update);
  }
}