// auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../models/auth.models';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ access_token: string }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const loadProfile = createAction(
  '[Auth] Load Profile',
  props<{ token: string }>()
);

export const loadProfileSuccess = createAction(
  '[Auth] Load Profile Success',
  props<{ profile: UserProfile }>()
);

export const loadProfileFailure = createAction(
  '[Auth] Load Profile Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');
