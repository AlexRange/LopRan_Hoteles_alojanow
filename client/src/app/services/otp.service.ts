import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';

@Injectable({
    providedIn: 'root'
})
export class OtpService {
    private apiUrl = environment.API_URL;

    constructor(private http: HttpClient) {}

    sendOtp(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/otp/send-otp`, { email });
    }

    verifyOtp(email: string, code_otp: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/otp/verify-otp`, { email, code_otp });
    }
}