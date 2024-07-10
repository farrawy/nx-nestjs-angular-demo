import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../models/auth.models';
import { UpdateProfile } from '../../interfaces/user.interface';
import { constants } from '../constants';

export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ token: string }>()
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);

export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ token: string; password: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

export const register = createAction(
  constants.REGISTER,
  props<{ name: string; email: string; password: string }>()
);

export const registerSuccess = createAction(
  constants.REGISTER_SUCCESS,
  props<{ profile: UserProfile }>()
);

export const registerFailure = createAction(
  constants.REGISTER_FAILURE,
  props<{ error: string }>()
);

export const login = createAction(
  constants.LOGIN,
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  constants.LOGIN_SUCCESS,
  props<{ access_token: string; expires_in: number }>()
);

export const loginFailure = createAction(
  constants.LOGIN_FAILURE,
  props<{ error: string }>()
);

export const loadProfile = createAction(
  constants.LOAD_PROFILE,
  props<{ token: string }>()
);

export const loadProfileSuccess = createAction(
  constants.LOAD_PROFILE_SUCCESS,
  props<{ profile: UserProfile }>()
);

export const loadProfileFailure = createAction(
  constants.LOAD_PROFILE_FAILURE,
  props<{ error: string }>()
);

export const logout = createAction(constants.LOGOUT);

export const updateProfile = createAction(
  constants.UPDATE_PROFILE,
  props<{ token: string; updateProfile: UpdateProfile }>()
);

export const updateProfileSuccess = createAction(
  constants.UPDATE_PROFILE_SUCCESS,
  props<{ profile: UserProfile }>()
);

export const updateProfileFailure = createAction(
  constants.UPDATE_PROFILE_FAILURE,
  props<{ error: string }>()
);

export const setRole = createAction(
  constants.SET_ROLE,
  props<{ role: string }>()
);

export const activateUser = createAction(
  '[Auth] Activate User',
  props<{ token: string; userId: string }>()
);

export const deactivateUser = createAction(
  '[Auth] Deactivate User',
  props<{ token: string; userId: string }>()
);
