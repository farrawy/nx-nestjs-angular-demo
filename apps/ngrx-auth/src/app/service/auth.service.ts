import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserProfile } from '../models/auth.models';
import { UpdateProfile } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiAuthUrl = `${environment.apiUrl}/auth`;
  private apiUrl = `${environment.apiUrl}`;
  private role: string | null = null;

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<{ access_token: string; expires_in: number }> {
    return this.http
      .post<{ access_token: string; expires_in: number }>(
        `${this.apiAuthUrl}/login`,
        { email, password }
      )
      .pipe(
        tap((response) => {
          const token = response.access_token;
          localStorage.setItem('token', token);
          this.getProfile(token).subscribe((profile) => {
            this.role = profile.role;
            localStorage.setItem('role', profile.role);
          });
        }),
        catchError(this.handleError)
      );
  }

  getProfile(token: string): Observable<UserProfile> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<UserProfile>(
      `${this.apiAuthUrl}/profile`,
      {},
      { headers }
    );
  }

  updateProfile(
    token: string,
    updateProfileDto: UpdateProfile
  ): Observable<UserProfile> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserProfile>(
      `${this.apiAuthUrl}/profile`,
      updateProfileDto,
      { headers }
    );
  }

  activateUser(token: string, userId: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(
      `${this.apiUrl}/admin/users/${userId}/activate`,
      {},
      { headers }
    );
  }

  deactivateUser(token: string, userId: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<void>(
      `${this.apiUrl}/admin/users/${userId}/deactivate`,
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

  getRole(): string | null {
    if (!this.role) {
      this.role = localStorage.getItem('role');
    }
    return this.role;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.role = null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
