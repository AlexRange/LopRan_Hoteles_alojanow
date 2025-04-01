import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { ReservacionesServicios } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesServiciosService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getReservacionesSA() {
    return this.http.get<ReservacionesServicios[]>(`${this.apiUrl}/reservacionesSer`);
  }

  deleteReservacionSA( id_reserva_servicio: string | number) {
    return this.http.delete(`${this.apiUrl}/reservacionesSer/${id_reserva_servicio}`);
  }

  saveReservacion(reservacionServicio: ReservacionesServicios): Observable<ReservacionesServicios> {
    return this.http.post<ReservacionesServicios>(
        `${this.apiUrl}/reservacionesSer`, 
        reservacionServicio
    ).pipe(
        catchError(error => {
            console.error('Error detallado al guardar:', error);
            let errorMsg = 'Error desconocido al guardar la reservacion';
            
            if (error.error) {
                if (error.error.message) {
                    errorMsg = error.error.message;
                } else if (error.error.error) {
                    errorMsg = error.error.error;
                }
            }
            
            throw new Error(errorMsg);
        })
    );
}

  updateReservacionSA(id_reserva_servicio: string | number, update: ReservacionesServicios): Observable<ReservacionesServicios> {
    return this.http.put<ReservacionesServicios>(`${this.apiUrl}/reservacionesSer/${id_reserva_servicio}`, update);
  }
}
