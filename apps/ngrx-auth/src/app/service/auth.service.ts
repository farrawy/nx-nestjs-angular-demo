import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserProfile, UserResponse } from '../models/auth.models';
import { UpdateProfile } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiAuthUrl = `${environment.apiUrl}/auth`;
  private apiUrl = `${environment.apiUrl}`;
  private role: string | null = null;

  constructor(private http: HttpClient) {}

  register(
    name: string,
    email: string,
    password: string
  ): Observable<UserProfile> {
    return this.http
      .post<UserProfile>(`${this.apiAuthUrl}/register`, {
        name,
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

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

  forgotPassword(email: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiAuthUrl}/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(token: string, password: string): Observable<string> {
    return this.http
      .post<string>(`${this.apiAuthUrl}/reset-password/${token}`, { password })
      .pipe(catchError(this.handleError));
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

  updateUserRole(userId: string, role: string): Observable<UserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .put<UserResponse>(
        `${this.apiUrl}/admin/users/${userId}/role`,
        { role },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  activateUser(userId: string): Observable<UserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserResponse>(
      `${this.apiUrl}/admin/users/${userId}/activate`,
      {},
      { headers }
    );
  }

  deactivateUser(userId: string): Observable<UserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<UserResponse>(
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

  getUsers(): Observable<UserResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<UserResponse[]>(`${this.apiUrl}/admin/users`, { headers })
      .pipe(catchError(this.handleError));
  }

  searchUsers(query: any): Observable<UserResponse[]> {
    let params = new HttpParams();
    Object.keys(query).forEach((key) => {
      if (query[key] !== '') {
        params = params.set(key, query[key]);
      }
    });
    return this.http.get<UserResponse[]>(`${this.apiUrl}/admin/search`, {
      params,
    });
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
