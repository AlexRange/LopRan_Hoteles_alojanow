import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { TipoHabitacion } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
  private apiUrl = `${environment.API_URL}/tipos-habitacion`;

  constructor(private http: HttpClient) { }

  // Obtener todos los tipos de habitación
  getTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener un tipo de habitación por ID
  getTipoHabitacion(id_tipo_habitacion: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(`${this.apiUrl}/${id_tipo_habitacion}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear un nuevo tipo de habitación
  createTipoHabitacion(tipo: TipoHabitacion): Observable<any> {
    return this.http.post(this.apiUrl, tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar un tipo de habitación
  updateTipoHabitacion(id_tipo_habitacion: number, tipo: TipoHabitacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id_tipo_habitacion}`,tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar un tipo de habitación
  deleteTipoHabitacion(id_tipo_habitacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_tipo_habitacion}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `Código de error: ${error.status}, ` +
        `mensaje: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error
    return throwError('Algo salió mal; por favor intenta nuevamente más tarde.');
  }
}