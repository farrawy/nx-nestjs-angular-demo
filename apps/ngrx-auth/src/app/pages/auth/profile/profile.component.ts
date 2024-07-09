import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import {
  selectUserProfile,
  selectAuthLoading,
  selectAuthError,
  selectAuthRole,
} from '../../../store/auth/auth.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserProfile } from '../../../models/auth.models';
import { UpdateProfile } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  token: string | null = null;
  role: string | null = null;
  loading = false;
  error: string | null = null;
  editMode = false;

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''), // Optional field
    isActive: new FormControl(false), // Optional field
  });

  constructor(private store: Store<AuthState>) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    console.log('Token from localStorage:', this.token); // Log to verify

    if (this.token) {
      this.store.dispatch(AuthActions.loadProfile({ token: this.token })); // Dispatch the action to load profile
    }

    this.store.select(selectUserProfile).subscribe((profile) => {
      this.profile = profile;
      console.log('User Profile: ', profile);
      if (profile) {
        this.profileForm.patchValue({
          name: profile.name,
          email: profile.email,
          isActive: profile.isActive, // Patch isActive
        });
      }
    });

    this.store.select(selectAuthRole).subscribe((role) => {
      if (role) {
        this.role = role;
        console.log('User Role: ', role);
      }
    });

    this.store.select(selectAuthLoading).subscribe((loading) => {
      this.loading = loading;
    });

    this.store.select(selectAuthError).subscribe((error) => {
      this.error = error;
    });
  }

  onSubmit() {
    if (this.profileForm.valid && this.token) {
      const updateProfile: UpdateProfile = {
        name: this.profileForm.value.name!,
        email: this.profileForm.value.email!,
        password: this.profileForm.value.password || '', // Ensure password is not undefined
        isActive: this.profileForm.value.isActive!, // Ensure isActive is not undefined
      };
      this.store.dispatch(
        AuthActions.updateProfile({ token: this.token, updateProfile })
      );
      this.toggleEditMode();
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  onDeactivate() {
    if (
      confirm(
        'Are you sure you want to deactivate your account? You can activate it by logging in again.'
      )
    ) {
      if (this.profile && this.token) {
        const updateProfile: UpdateProfile = {
          ...this.profile,
          password: '', // Ensure password is not undefined
          isActive: false,
        };
        this.store.dispatch(
          AuthActions.updateProfile({ token: this.token, updateProfile })
        );
        this.onLogout();
      }
    }
  }

  onAdminDeactivateUser(userId: string) {
    if (this.token && this.role === 'admin') {
      this.store.dispatch(
        AuthActions.deactivateUser({ token: this.token, userId })
      );
    }
  }

  onAdminActivateUser(userId: string) {
    if (this.token && this.role === 'admin') {
      this.store.dispatch(
        AuthActions.activateUser({ token: this.token, userId })
      );
    }
  }
}
