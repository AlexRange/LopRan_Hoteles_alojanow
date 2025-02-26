import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Habitaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getHabitacion() {
    return this.http.get<Habitaciones[]>(`${this.API_URI}/habitaciones`);
  }

  deleteHabitacion(id_habitacion: string | number) {
    return this.http.delete(`${this.API_URI}/habitaciones/${id_habitacion}`);
  }

  saveHabitacion(evento: Habitaciones): Observable<any> {
    return this.http.post(`${this.API_URI}/habitaciones`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar la habitacion', error);
        return of(null);
      })
    );
  }

  updateHabitacion(id_habitacion: string | number, update: Habitaciones): Observable<Habitaciones> {
    return this.http.put<Habitaciones>(`${this.API_URI}/habitaciones/${id_habitacion}`, update);
  }
}
