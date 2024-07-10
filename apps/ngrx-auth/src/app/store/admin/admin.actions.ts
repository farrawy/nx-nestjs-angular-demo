import { createAction, props } from '@ngrx/store';
import { UserResponse } from '../../models/auth.models';

export const loadUsers = createAction('[Admin] Load Users');
export const loadUsersSuccess = createAction(
  '[Admin] Load Users Success',
  props<{ users: UserResponse[] }>()
);
export const loadUsersFailure = createAction(
  '[Admin] Load Users Failure',
  props<{ error: string }>()
);

export const searchUsers = createAction(
  '[Admin] Search Users',
  props<{ query: any }>()
);
export const searchUsersSuccess = createAction(
  '[Admin] Search Users Success',
  props<{ users: UserResponse[] }>()
);
export const searchUsersFailure = createAction(
  '[Admin] Search Users Failure',
  props<{ error: string }>()
);

export const activateUser = createAction(
  '[Admin] Activate User',
  props<{ userId: string }>()
);
export const activateUserSuccess = createAction(
  '[Admin] Activate User Success',
  props<{ user: UserResponse }>()
);
export const activateUserFailure = createAction(
  '[Admin] Activate User Failure',
  props<{ error: string }>()
);

export const deactivateUser = createAction(
  '[Admin] Deactivate User',
  props<{ userId: string }>()
);
export const deactivateUserSuccess = createAction(
  '[Admin] Deactivate User Success',
  props<{ user: UserResponse }>()
);
export const deactivateUserFailure = createAction(
  '[Admin] Deactivate User Failure',
  props<{ error: string }>()
);

export const updateUserRole = createAction(
  '[Admin] Update User Role',
  props<{ userId: string; role: string }>()
);
export const updateUserRoleSuccess = createAction(
  '[Admin] Update User Role Success',
  props<{ user: UserResponse }>()
);
export const updateUserRoleFailure = createAction(
  '[Admin] Update User Role Failure',
  props<{ error: string }>()
);
