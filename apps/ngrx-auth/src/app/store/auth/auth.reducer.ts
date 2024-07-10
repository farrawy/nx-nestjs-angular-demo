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
  on(AuthActions.forgotPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.forgotPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.forgotPasswordFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.resetPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.resetPasswordSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
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
