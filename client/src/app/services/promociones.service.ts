import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Promociones } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {

  API_URI = 'http://localhost:3000/api';
  
    constructor(private http: HttpClient) { }
  
    getPromociones() {
      return this.http.get<Promociones[]>(`${this.API_URI}/promociones `);
    }
  
    deletePromocion(id_promocion: string | number) {
      return this.http.delete(`${this.API_URI}/promociones/${id_promocion}`);
    }
  
    savePromocion(evento: Promociones): Observable<any> {
      return this.http.post(`${this.API_URI}/promociones`, evento).pipe(
        catchError(error => {
          console.error('Error al guardar la promocion', error);
          return of(null);
        })
      );
    }
  
    updatePromoxion(id_promocion: string | number, update: Promociones): Observable<Promociones> {
      return this.http.put<Promociones>(`${this.API_URI}/promociones/${id_promocion}`, update);
    }
}
