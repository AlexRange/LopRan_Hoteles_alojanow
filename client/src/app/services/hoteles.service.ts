import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Hoteles } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  // API_URI = 'http://localhost:3000/api';
  API_URI = 'https://9gc26mcr-3000.usw3.devtunnels.ms/api';
  
  constructor(private http: HttpClient) { }

  getHotel() {
    return this.http.get<Hoteles[]>(`${this.API_URI}/hoteles`);
  }

  deleteHotel(id_hotel: string | number) {
    return this.http.delete(`${this.API_URI}/hoteles/${id_hotel}`);
  }

  saveHotel(evento: Hoteles): Observable<any> {
    return this.http.post(`${this.API_URI}/hoteles`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el hotel:', error);
        return of(null);
      })
    );
  }

  updateHotel(id_hotel: string | number, update: Hoteles): Observable<Hoteles> {
    return this.http.put<Hoteles>(`${this.API_URI}/hoteles/${id_hotel}`, update);
  }
}
