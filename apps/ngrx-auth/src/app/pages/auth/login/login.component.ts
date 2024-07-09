import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { selectAuthToken } from '../../../store/auth/auth.selectors';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  token: string | null = null;
  errorMessage: string | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private store: Store<AuthState>,
    private authService: AuthService
  ) {}

  handleSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email && password) {
        this.authService.login(email, password).subscribe({
          next: (response) => {
            this.store.dispatch(
              AuthActions.loginSuccess({
                access_token: response.access_token,
                expires_in: response.expires_in,
              })
            );
            this.errorMessage = null;
          },
          error: (error) => {
            this.errorMessage = error;
          },
        });
      }
    } else {
      this.loginForm.markAllAsTouched(); // Highlight errors if the form is invalid
    }
  }

  ngOnInit() {
    this.store.select(selectAuthToken).subscribe((token) => {
      this.token = token;
      console.log('Auth Token: ', token);
    });
  }
}
