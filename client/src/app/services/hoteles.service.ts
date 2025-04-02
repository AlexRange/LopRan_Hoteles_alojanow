import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Hoteles } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  // Obtener todos los hoteles
  getHotel(): Observable<Hoteles[]> {
    return this.http.get<any>(`${this.apiUrl}/hoteles`).pipe(
      map(response => {
        // Handle different response structures
        if (Array.isArray(response)) {
          return response;
        } else if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
        throw new Error('Unexpected response format');
      }),
      catchError(error => {
        console.error('Detailed error fetching hotels:', error);
        if (error.error && error.error.message) {
          console.error('Backend error message:', error.error.message);
        }
        return of([]);
      })
    );
  }

  // Eliminar un hotel
  deleteHotel(id_hotel: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hoteles/${id_hotel}`).pipe(
      catchError(error => {
        console.error(`Error deleting hotel with ID ${id_hotel}:`, error);
        return of({ message: 'Error deleting hotel' });
      })
    );
  }

  // Crear un nuevo hotel
  saveHotel(hotel: Hoteles): Observable<any> {
    return this.http.post(`${this.apiUrl}/hoteles`, hotel).pipe(
      catchError(error => {
        console.error('Error saving hotel:', error);
        return of({ message: 'Error saving hotel' });
      })
    );
  }

  // Actualizar un hotel existente
  updateHotel(id_hotel: string | number, hotel: Hoteles): Observable<any> {
    return this.http.put(`${this.apiUrl}/hoteles/${id_hotel}`, hotel).pipe(
      catchError(error => {
        console.error(`Error updating hotel with ID ${id_hotel}:`, error);
        return of({ message: 'Error updating hotel' });
      })
    );
  }
}