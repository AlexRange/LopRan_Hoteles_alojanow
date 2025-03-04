import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagos } from '../models/modelos';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  API_URI = 'http://localhost:3000/api';
  
    constructor(private http: HttpClient) { }
  
    getPagos() {
      return this.http.get<Pagos[]>(`${this.API_URI}/pagos`);
    }
  
    deletePago(id_pago: string | number) {
      return this.http.delete(`${this.API_URI}/pagos/${id_pago}`);
    }
  
    savePago(evento: Pagos): Observable<any> {
      return this.http.post(`${this.API_URI}/pagos`, evento).pipe(
        catchError(error => {
          console.error('Error al guardar el pago', error);
          return of(null);
        })
      );
    }
  
    updatePago(id_pago: string | number, update: Pagos): Observable<Pagos> {
      return this.http.put<Pagos>(`${this.API_URI}/pagos/${id_pago}`, update);
    }
}
