import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.reducer';
import { selectAuthRole } from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private store: Store<AuthState>, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectAuthRole).pipe(
      map((role) => {
        if (role === 'admin') {
          return true;
        } else {
          this.router.navigate(['/profile']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/profile']);
        return of(false);
      })
    );
  }
}
