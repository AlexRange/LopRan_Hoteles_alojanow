import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { Hoteles } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {
  private apiUrl = environment.API_URL;
  
  constructor(private http: HttpClient) { }

  // Obtener todos los hoteles (Método existente - sin cambios)
  getHotel(): Observable<Hoteles[]> {
    return this.http.get<any>(`${this.apiUrl}/hoteles`).pipe(
      map(response => {
        return response.data || response;
      }),
      catchError(error => {
        console.error('Error fetching hotels:', error);
        return of([]);
      })
    );
  }

  // Eliminar un hotel (Método existente - sin cambios)
  deleteHotel(id_hotel: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hoteles/${id_hotel}`).pipe(
      catchError(error => {
        console.error(`Error deleting hotel with ID ${id_hotel}:`, error);
        return of({ message: 'Error deleting hotel' });
      })
    );
  }

  // Crear un nuevo hotel (Método existente - sin cambios)
  saveHotel(hotel: Hoteles): Observable<any> {
    return this.http.post(`${this.apiUrl}/hoteles`, hotel).pipe(
      catchError(error => {
        console.error('Error saving hotel:', error);
        return of({ message: 'Error saving hotel' });
      })
    );
  }

  // Actualizar un hotel existente (Método existente - sin cambios)
  updateHotel(id_hotel: string | number, hotel: Hoteles): Observable<any> {
    return this.http.put(`${this.apiUrl}/hoteles/${id_hotel}`, hotel).pipe(
      catchError(error => {
        console.error(`Error updating hotel with ID ${id_hotel}:`, error);
        return of({ message: 'Error updating hotel' });
      })
    );
  }

  // NUEVO MÉTODO: Obtener un hotel específico por ID
  getOneHotel(id_hotel: string | number): Observable<Hoteles | null> {
    return this.http.get<Hoteles>(`${this.apiUrl}/hoteles/${id_hotel}`).pipe(
      catchError(error => {
        console.error(`Error fetching hotel with ID ${id_hotel}:`, error);
        return of(null);
      })
    );
  }

  // NUEVO MÉTODO: Subir imagen del hotel
  uploadImage(file: File): Observable<{ filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ filename: string }>(
      `${this.apiUrl}/hoteles/upload`,
      formData
    );
  }

    // Buscar hoteles por término (nombre, ciudad, país, etc.)
    buscarHoteles(termino: string): Observable<Hoteles[]> {
      // Si tu backend soporta búsqueda con query params
      const params = new HttpParams().set('q', termino);
      
      return this.http.get<any>(`${this.apiUrl}/hoteles/buscar`, { params }).pipe(
        map(response => {
          return response.data || response;
        }),
        catchError(error => {
          console.error('Error searching hotels:', error);
          return of([]);
        })
      );
    }

  getImageUrl(imageName: string | null | undefined): string {
    // Asegúrate de que coincida con la ruta de almacenamiento en el backend
    return `${environment.API_URL}/uploads/hoteles/${imageName}`;
  }



}