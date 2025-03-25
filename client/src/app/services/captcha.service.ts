import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  // Método para verificar el reCAPTCHA
  verifyRecaptcha(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recaptcha`, { token });
  }
}
