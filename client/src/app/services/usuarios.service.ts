import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroments';
import { Usuarios } from '../models/modelos';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  // Obtener un usuario por ID
  getUsuario(id_usuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id_usuario}`);
  }

  // Crear un nuevo usuario
  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  // Actualizar un usuario existente
  updateUsuario(id_usuario: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id_usuario}`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(id_usuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id_usuario}`);
  }

  // Método para enviar el código de verificación
  enviarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/send-passwd`, { email });
  }

  // Método para enviar el código de verificación
  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/send-code`, { email });
  }

  verificarCodigo(email: string, code: string): Observable<any> {
    const trimmedCode = code.trim(); // Eliminar espacios al inicio y fin
    console.log('Enviando a verificación:', { email, trimmedCode });
  
    return this.http.post(`${this.apiUrl}/usuarios/verify-code`, {
      email,
      code: trimmedCode
    });
  }
  

  private temporalUsuarioSubject = new BehaviorSubject<Usuarios | null>(null);
  temporalUsuario$ = this.temporalUsuarioSubject.asObservable();

  // Guardar temporalmente los datos del usuario
  guardarTemporalUsuario(usuario: Usuarios): void {
    this.temporalUsuarioSubject.next(usuario);
  }

  // Obtener los datos temporales del usuario
  obtenerTemporalUsuario(): Usuarios | null {
    return this.temporalUsuarioSubject.value;
  }

  // Limpiar los datos temporales
  limpiarTemporalUsuario(): void {
    this.temporalUsuarioSubject.next(null);
  }
}
