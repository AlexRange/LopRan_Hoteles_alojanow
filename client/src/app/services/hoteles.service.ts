import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hoteles } from '../models/modelos';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  API_URI = 'http://localhost:3000/api';
  
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
