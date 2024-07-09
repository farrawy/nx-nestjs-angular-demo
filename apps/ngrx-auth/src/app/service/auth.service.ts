// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserProfile } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{ access_token: string; expires_in: number }> {
    return this.http.post<{ access_token: string; expires_in: number }>(
      `${this.apiUrl}/login`,
      {
        email,
        password,
      }
    );
  }

  getProfile(token: string): Observable<UserProfile> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Fetching profile with token:', token); // Log to verify
    return this.http.post<UserProfile>(
      `${this.apiUrl}/profile`,
      {},
      { headers }
    );
  }

  initAutoLogout() {
    const expirationTime = localStorage.getItem('token_expiration');
    if (expirationTime) {
      const expiresIn = +expirationTime - new Date().getTime();
      if (expiresIn > 0) {
        setTimeout(() => {
          this.logout();
        }, expiresIn);
      } else {
        this.logout();
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
  }
}
