// auth.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token
);
export const selectUserProfile = createSelector(
  selectAuthState,
  (state) => state.profile
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);