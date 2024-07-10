import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  selectAuthLoading,
  selectAuthError,
} from '../../../store/auth/auth.selectors';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(private store: Store<AuthState>) {}

  handleSubmit() {
    if (this.registerForm.valid) {
      const name = this.registerForm.value.name ?? '';
      const email = this.registerForm.value.email ?? '';
      const password = this.registerForm.value.password ?? '';
      this.store.dispatch(AuthActions.register({ name, email, password }));
    }
  }
}
