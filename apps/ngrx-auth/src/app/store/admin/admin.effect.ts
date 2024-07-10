import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as AdminActions from './admin.actions';
import { AuthService } from '../../service/auth.service';

@Injectable()
export class AdminEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

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

  activateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.activateUser),
      mergeMap((action) =>
        this.authService.activateUser(action.userId).pipe(
          map((user) => AdminActions.activateUserSuccess({ user })),
          catchError((error) =>
            of(AdminActions.updateUserRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deactivateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deactivateUser),
      mergeMap((action) =>
        this.authService.deactivateUser(action.userId).pipe(
          map((user) => AdminActions.deactivateUserSuccess({ user })),
          catchError((error) =>
            of(AdminActions.updateUserRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.updateUserRole),
      mergeMap((action) =>
        this.authService.updateUserRole(action.userId, action.role).pipe(
          map((user) => AdminActions.updateUserRoleSuccess({ user })),
          catchError((error) =>
            of(AdminActions.updateUserRoleFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
