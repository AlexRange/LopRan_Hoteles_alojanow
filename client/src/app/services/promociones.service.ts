import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Promociones } from '../models/modelos';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PromocionesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getPromociones() {
    return this.http.get<Promociones[]>(`${this.apiUrl}/promociones `);
  }

  deletePromocion(id_promocion: string | number) {
    return this.http.delete(`${this.apiUrl}/promociones/${id_promocion}`);
  }

  savePromocion(evento: Promociones): Observable<any> {
    return this.http.post(`${this.apiUrl}/promociones`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar la promocion', error);
        return of(null);
      })
    );
  }

  updatePromoxion(id_promocion: string | number, update: Promociones): Observable<Promociones> {
    return this.http.put<Promociones>(`${this.apiUrl}/promociones/${id_promocion}`, update);
  }
}
