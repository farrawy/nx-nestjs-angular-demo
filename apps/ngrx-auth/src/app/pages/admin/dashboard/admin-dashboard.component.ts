import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AdminState } from '../../../store/admin/admin.reducer';
import * as AdminActions from '../../../store/admin/admin.actions';
import {
  selectUsers,
  selectAdminLoading,
  selectAdminError,
} from '../../../store/admin/admin.selectors';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AdminDashboardComponent implements OnInit {
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectAdminLoading);
  error$ = this.store.select(selectAdminError);

  searchForm = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    role: new FormControl(''),
    isActive: new FormControl(''),
  });

  constructor(private store: Store<AdminState>) {}

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadUsers());
  }

  onSearch() {
    const query = this.searchForm.value;
    this.store.dispatch(AdminActions.searchUsers({ query }));
  }

  clearFilters() {
    this.searchForm.setValue({
      email: '',
      name: '',
      role: '',
      isActive: '',
    });
    this.store.dispatch(AdminActions.loadUsers());
  }

  updateUserRole(userId: string, role: string) {
    this.store.dispatch(AdminActions.updateUserRole({ userId, role }));
  }

  activateUser(userId: string) {
    this.store.dispatch(AdminActions.activateUser({ userId }));
  }

  deactivateUser(userId: string) {
    this.store.dispatch(AdminActions.deactivateUser({ userId }));
  }
}
