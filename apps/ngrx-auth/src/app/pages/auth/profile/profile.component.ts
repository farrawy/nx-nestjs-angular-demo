// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import {
  selectUserProfile,
  selectAuthLoading,
  selectAuthError,
} from '../../../store/auth/auth.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import { UserProfile } from '../../../models/auth.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  token: string | null = null;
  loading = false;
  error: string | null = null;

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
    });

    this.store.select(selectAuthLoading).subscribe((loading) => {
      this.loading = loading;
    });

    this.store.select(selectAuthError).subscribe((error) => {
      this.error = error;
    });
  }
}
