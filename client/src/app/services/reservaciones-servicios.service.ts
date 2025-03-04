import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ReservacionesServicios } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesServiciosService {

  API_URI = 'http://localhost:3000/api';
  
    constructor(private http: HttpClient) { }
  
    getReservaciones() {
      return this.http.get<ReservacionesServicios []>(`${this.API_URI}/reservacionesSer`);
    }
  
    deleteReservacion(id_reservacion: string | number) {
      return this.http.delete(`${this.API_URI}/reservacionesSer/${id_reservacion}`);
    }
  
    saveReservacion(evento: ReservacionesServicios): Observable<any> {
      return this.http.post(`${this.API_URI}/reservacionesSer`, evento).pipe(
        catchError(error => {
          console.error('Error al guardar el Service ad', error);
          return of(null);
        })
      );
    }
  
    updateReservacion(id_reservacion: string | number, update: ReservacionesServicios): Observable<ReservacionesServicios> {
      return this.http.put<ReservacionesServicios>(`${this.API_URI}/reservacionesSer/${id_reservacion}`, update);
    }
}
