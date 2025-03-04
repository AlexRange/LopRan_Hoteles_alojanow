import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiciosAdicionales } from '../models/modelos';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdicionalesService {
  API_URI = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getServicioAd() {
    return this.http.get<ServiciosAdicionales[]>(`${this.API_URI}/serviciosAd`);
  }

  deleteServicioAd(id_servicio: string | number) {
    return this.http.delete(`${this.API_URI}/serviciosAd/${id_servicio}`);
  }

  saveServicioAd(evento: ServiciosAdicionales): Observable<any> {
    return this.http.post(`${this.API_URI}/serviciosAd`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el Service ad', error);
        return of(null);
      })
    );
  }

  updateServicioAd(id_servicio: string | number, update: ServiciosAdicionales): Observable<ServiciosAdicionales> {
    return this.http.put<ServiciosAdicionales>(`${this.API_URI}/serviciosAd/${id_servicio}`, update);
  }
}
