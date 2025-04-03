import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { Habitaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getHabitacion() {
    return this.http.get<Habitaciones[]>(`${this.apiUrl}/habitaciones`);
  }

  deleteHabitacion(id_habitacion: string | number) {
    return this.http.delete(`${this.apiUrl}/habitaciones/${id_habitacion}`);
  }

  saveHabitacion(evento: Habitaciones): Observable<any> {
    return this.http.post(`${this.apiUrl}/habitaciones`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar la habitacion', error);
        return of(null);
      })
    );
  }

  updateHabitacion(id_habitacion: string | number, update: Habitaciones): Observable<Habitaciones> {
    return this.http.put<Habitaciones>(`${this.apiUrl}/habitaciones/${id_habitacion}`, update);
  }

  getHabitacionesByHotel(id_hotel: number): Observable<Habitaciones[]> {
    return this.http.get<Habitaciones[]>(`${this.apiUrl}/habitaciones/hotel/${id_hotel}`);
  }
  
}
