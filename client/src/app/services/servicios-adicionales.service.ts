import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';
import { ServiciosAdicionales } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ServiciosAdicionalesService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getServicios() {
    return this.http.get<ServiciosAdicionales[]>(`${this.apiUrl}/serviciosAd`);
  }

  deleteServicio(id_servicio: string | number) {
    return this.http.delete(`${this.apiUrl}/serviciosAd/${id_servicio}`);
  }

  createServicio(evento: ServiciosAdicionales): Observable<any> {
    return this.http.post(`${this.apiUrl}/serviciosAd`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el Service ad', error);
        return of(null);
      })
    );
  }

  updateServicio(id_servicio: string | number, update: ServiciosAdicionales): Observable<ServiciosAdicionales> {
    return this.http.put<ServiciosAdicionales>(`${this.apiUrl}/serviciosAd/${id_servicio}`, update);
  }

  // Obtener los servicios asociados a un hotel específico
  getServiciosByHotel(id_hotel: string | number): Observable<ServiciosAdicionales[]> {
    return this.http.get<ServiciosAdicionales[]>(`${this.apiUrl}/hoteles-servicios/${id_hotel}`).pipe(
      catchError(error => {
        console.error('Error fetching services for hotel', error);
        return of([]);
      })
    );
  }

  // Agregar un servicio a un hotel
  addServicioToHotel(id_hotel: string | number, id_servicio: string | number): Observable<any> {
    return this.http.post(`${this.apiUrl}/hoteles-servicios/${id_hotel}/${id_servicio}`, {}).pipe(
      catchError(error => {
        console.error('Error adding service to hotel', error);
        return of(null);
      })
    );
  }

  // Eliminar un servicio de un hotel
  removeServicioFromHotel(id_hotel: string | number, id_servicio: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/hoteles-servicios/${id_hotel}/${id_servicio}`).pipe(
      catchError(error => {
        console.error('Error removing service from hotel', error);
        return of(null);
      })
    );
  }
}
