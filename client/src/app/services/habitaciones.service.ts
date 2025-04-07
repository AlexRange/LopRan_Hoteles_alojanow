import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { Habitaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getHabitacion(): Observable<Habitaciones[]> {
    return this.http.get<any>(`${this.apiUrl}/habitaciones`).pipe(
        map(response => {
            return response.data || response;
        }),
        catchError(error => {
            console.error('Error al obtener habitaciones:', error);
            return of([]);
        })
    );
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

  // NUEVO MÉTODO: Subir imagen del hotel
  uploadImage(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ filename: string }>(
      `${this.apiUrl}/habitaciones/upload`,
      formData
    );
  }

  getImageUrl(imageName: string | null | undefined): string {
    if (!imageName) {
        return ''; // O una imagen por defecto
    }
    // Si ya es una URL completa, retórnala tal cual
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
        return imageName;
    }
    // Si no, construye la URL completa
    return `${environment.API_URL}/uploads/habitaciones/${imageName}`;
}
}
