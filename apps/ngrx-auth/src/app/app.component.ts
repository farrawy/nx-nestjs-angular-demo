import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthState } from './store/auth/auth.reducer';
import * as AuthActions from './store/auth/auth.actions';
import { selectAuthToken } from './store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule, AsyncPipe],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ngrx-auth';
  token$: Observable<string | null>;

  constructor(private store: Store<AuthState>) {
    this.token$ = this.store.select(selectAuthToken);
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
