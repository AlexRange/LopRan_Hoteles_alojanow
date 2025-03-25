import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiciosAdicionales } from '../models/modelos';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AdicionalesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getServicioAd() {
    return this.http.get<ServiciosAdicionales[]>(`${this.apiUrl}/serviciosAd`);
  }

  deleteServicioAd(id_servicio: string | number) {
    return this.http.delete(`${this.apiUrl}/serviciosAd/${id_servicio}`);
  }

  saveServicioAd(evento: ServiciosAdicionales): Observable<any> {
    return this.http.post(`${this.apiUrl}/serviciosAd`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el Service ad', error);
        return of(null);
      })
    );
  }

  updateServicioAd(id_servicio: string | number, update: ServiciosAdicionales): Observable<ServiciosAdicionales> {
    return this.http.put<ServiciosAdicionales>(`${this.apiUrl}/serviciosAd/${id_servicio}`, update);
  }
}
