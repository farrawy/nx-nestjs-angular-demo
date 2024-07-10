import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import * as AdminActions from '../admin/admin.actions';

import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService
          .register(action.name, action.email, action.password)
          .pipe(
            map((profile) => AuthActions.registerSuccess({ profile })),
            tap(() => this.router.navigate(['/login'])),
            catchError((error) =>
              of(AuthActions.registerFailure({ error: error.message }))
            )
          )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response) => {
            const expirationTime =
              new Date().getTime() + response.expires_in * 1000;
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('token_expiration', expirationTime.toString());
            // replace the current route with the profile route so the user can't go back
            this.router.navigate(['/profile'], { replaceUrl: true });
            return AuthActions.loginSuccess({
              access_token: response.access_token,
              expires_in: response.expires_in,
            });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.authService.initAutoLogout()),
      switchMap((action) =>
        this.authService.getProfile(action.access_token).pipe(
          map((profile) => {
            localStorage.setItem('role', profile.role);
            this.router.navigate(['/profile'], { replaceUrl: true });
            return AuthActions.loadProfileSuccess({ profile });
          }),
          catchError((error) =>
            of(AuthActions.loadProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadUsers),
      mergeMap(() =>
        this.authService.getUsers().pipe(
          map((users) => AdminActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(AdminActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.searchUsers),
      mergeMap((action) =>
        this.authService.searchUsers(action.query).pipe(
          map((users) => AdminActions.searchUsersSuccess({ users })),
          catchError((error) =>
            of(AdminActions.searchUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      mergeMap((action) =>
        this.authService.getProfile(action.token).pipe(
          map((profile) => {
            localStorage.setItem('role', profile.role);
            return AuthActions.loadProfileSuccess({ profile });
          }),
          catchError((error) =>
            of(AuthActions.loadProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  forgotPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.forgotPassword),
      mergeMap((action) =>
        this.authService.forgotPassword(action.email).pipe(
          map((response) =>
            AuthActions.forgotPasswordSuccess({ token: response.token })
          ),
          catchError((error) =>
            of(AuthActions.forgotPasswordFailure({ error: error.message }))
          )
        )
      )
    )
  );

  forgotPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.forgotPasswordSuccess),
        tap((action) =>
          this.router.navigate([`/reset-password/${action.token}`])
        )
      ),
    { dispatch: false }
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPassword),
      mergeMap((action) =>
        this.authService.resetPassword(action.token, action.password).pipe(
          map((response) =>
            AuthActions.resetPasswordSuccess({ message: response })
          ),
          catchError((error) =>
            of(AuthActions.resetPasswordFailure({ error: error.message }))
          )
        )
      )
    )
  );

  resetPasswordSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.resetPasswordSuccess),
        tap((action) => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('token_expiration');
          localStorage.removeItem('role');
          this.router.navigate(['/login'], { replaceUrl: true });
        })
      ),
    { dispatch: false }
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap((action) =>
        this.authService.updateProfile(action.token, action.updateProfile).pipe(
          map((profile) => AuthActions.updateProfileSuccess({ profile })),
          catchError((error) =>
            of(AuthActions.updateProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  activateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.activateUser),
      mergeMap((action) =>
        this.authService.activateUser(action.userId).pipe(
          map(() => AuthActions.loadProfile({ token: action.token })),
          catchError((error) =>
            of(AuthActions.loadProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deactivateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deactivateUser),
      mergeMap((action) =>
        this.authService.deactivateUser(action.userId).pipe(
          map(() => AuthActions.loadProfile({ token: action.token })),
          catchError((error) =>
            of(AuthActions.loadProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
