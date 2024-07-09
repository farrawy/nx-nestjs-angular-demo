import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { UserProfile } from '../../models/auth.models';

export interface AuthState {
  token: string | null;
  profile: UserProfile | null;
  error: string | null;
  loading: boolean;
  role?: string | null;
}

export const initialState: AuthState = {
  token: localStorage.getItem('token'),
  profile: null,
  error: null,
  loading: false,
  role: localStorage.getItem('role'),
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { access_token }) => ({
    ...state,
    token: access_token,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    error: null,
  })),
  on(AuthActions.loadProfileFailure, (state, { error }) => ({
    ...state,
    profile: null,
    loading: false,
    error,
  })),
  on(AuthActions.updateProfile, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    error: null,
  })),
  on(AuthActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.setRole, (state, { role }) => ({
    ...state,
    role,
  }))
);
