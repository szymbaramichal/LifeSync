import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ExpensesTopBar } from "../expenses-top-bar/expenses-top-bar";
import { ExpensesList } from '../expenses-list/expenses-list';

@Component({
  selector: 'app-expenses-dashboard',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTabGroup,
    MatTab,
    ExpensesTopBar,
    ExpensesList
],
  templateUrl: './expenses-dashboard.html',
  styleUrl: './expenses-dashboard.css',
})
export class ExpensesDashboard {
  selectedGroupId = signal<string>('');

  onGroupChange($event: string): void {
    console.log($event);
    this.selectedGroupId.set($event);
  }
}
