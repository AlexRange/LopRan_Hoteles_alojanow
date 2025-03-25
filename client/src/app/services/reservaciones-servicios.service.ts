import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ReservacionesServicios } from '../models/modelos';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesServiciosService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getReservaciones() {
    return this.http.get<ReservacionesServicios[]>(`${this.apiUrl}/reservacionesSer`);
  }

  deleteReservacion(id_reservacion: string | number) {
    return this.http.delete(`${this.apiUrl}/reservacionesSer/${id_reservacion}`);
  }

  saveReservacion(evento: ReservacionesServicios): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservacionesSer`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el Service ad', error);
        return of(null);
      })
    );
  }

  updateReservacion(id_reservacion: string | number, update: ReservacionesServicios): Observable<ReservacionesServicios> {
    return this.http.put<ReservacionesServicios>(`${this.apiUrl}/reservacionesSer/${id_reservacion}`, update);
  }
}
