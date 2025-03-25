import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagos } from '../models/modelos';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  getPagos() {
    return this.http.get<Pagos[]>(`${this.apiUrl}/pagos`);
  }

  deletePago(id_pago: string | number) {
    return this.http.delete(`${this.apiUrl}/pagos/${id_pago}`);
  }

  savePago(evento: Pagos): Observable<any> {
    return this.http.post(`${this.apiUrl}/pagos`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar el pago', error);
        return of(null);
      })
    );
  }

  updatePago(id_pago: string | number, update: Pagos): Observable<Pagos> {
    return this.http.put<Pagos>(`${this.apiUrl}/pagos/${id_pago}`, update);
  }
}
