import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Hoteles } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {
  private apiUrl = environment.API_URL;
  
  constructor(private http: HttpClient) { }

  getHotel() {
    return this.http.get<Hoteles[]>(`${this.apiUrl}/hoteles`);
  }

  deleteHotel(id_hotel: string | number) {
    return this.http.delete(`${this.apiUrl}/hoteles/${id_hotel}`);
  }

  saveHotel(evento: Hoteles): Observable<any> {
    return this.http.post(`${this.apiUrl}/hoteles`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el hotel:', error);
        return of(null);
      })
    );
  }

  updateHotel(id_hotel: string | number, update: Hoteles): Observable<Hoteles> {
    return this.http.put<Hoteles>(`${this.apiUrl}/hoteles/${id_hotel}`, update);
  }
}
