import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ComentariosCalificaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  API_URI = 'http://localhost:3000/api';
      
      constructor(private http: HttpClient) { }
    
      getComentarios() {
        return this.http.get<ComentariosCalificaciones[]>(`${this.API_URI}/comentarios`);
      }
    
      deleteComentario(id_habitacion: string | number) {
        return this.http.delete(`${this.API_URI}/comentarios/${id_habitacion}`);
      }
    
      saveComentario(evento: ComentariosCalificaciones): Observable<any> {
        return this.http.post(`${this.API_URI}/comentarios`, evento).pipe(
          catchError(error => {
            console.error('Error al guardar el comentaroio', error);
            return of(null);
          })
        );
      }
    
      updateComentario(id_habitacion: string | number, update: ComentariosCalificaciones): Observable<ComentariosCalificaciones> {
        return this.http.put<ComentariosCalificaciones>(`${this.API_URI}/comentarios/${id_habitacion}`, update);
      }
}
