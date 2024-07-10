import { createReducer, on } from '@ngrx/store';
import * as AdminActions from './admin.actions';
import { UserResponse } from '../../models/auth.models';

export interface AdminState {
  users: UserResponse[];
  loading: boolean;
  error: string | null;
}

export const initialState: AdminState = {
  users: [],
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialState,
  on(AdminActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(AdminActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(AdminActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminActions.searchUsers, (state) => ({ ...state, loading: true })),
  on(AdminActions.searchUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(AdminActions.searchUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminActions.activateUser, (state) => ({ ...state, loading: true })),
  on(AdminActions.activateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: state.users.map((u) => (u._id === user._id ? user : u)),
  })),
  on(AdminActions.activateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminActions.deactivateUser, (state) => ({ ...state, loading: true })),
  on(AdminActions.deactivateUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: state.users.map((u) => (u._id === user._id ? user : u)),
  })),
  on(AdminActions.deactivateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AdminActions.updateUserRole, (state) => ({ ...state, loading: true })),
  on(AdminActions.updateUserRoleSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    users: state.users.map((u) => (u._id === user._id ? user : u)),
  })),
  on(AdminActions.updateUserRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
