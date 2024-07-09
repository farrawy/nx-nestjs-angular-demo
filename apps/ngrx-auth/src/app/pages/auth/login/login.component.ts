import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { selectAuthToken } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  token: string | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store<AuthState>) {}

  handleSubmit() {
    if (this.loginForm.valid) {
      if (this.loginForm.value.email && this.loginForm.value.password) {
        this.store.dispatch(
          AuthActions.login({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password,
          })
        );
      }
    }
  }

  ngOnInit() {
    this.store.select(selectAuthToken).subscribe((token) => {
      this.token = token;
      console.log('Auth Token: ', token);
    });
  }
}
