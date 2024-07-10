import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(private store: Store<AuthState>, private route: ActivatedRoute) {}

  handleSubmit() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    if (this.resetPasswordForm.valid && token) {
      const password = this.resetPasswordForm.value.password ?? '';
      this.store.dispatch(AuthActions.resetPassword({ token, password }));
    }
  }
}
