import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ComentariosCalificaciones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getComentarios() {
    return this.http.get<ComentariosCalificaciones[]>(`${this.apiUrl}/comentarios`);
  }

  deleteComentario(id_comentario: string | number) {
    return this.http.delete(`${this.apiUrl}/comentarios/${id_comentario}`);
  }

  saveComentario(evento: ComentariosCalificaciones): Observable<any> {
    return this.http.post(`${this.apiUrl}/comentarios`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el comentaroio', error);
        return of(null);
      })
    );
  }

  updateComentario(id_comentario: string | number, update: ComentariosCalificaciones): Observable<ComentariosCalificaciones> {
    return this.http.put<ComentariosCalificaciones>(`${this.apiUrl}/comentarios/${id_comentario}`, update);
  }
}
