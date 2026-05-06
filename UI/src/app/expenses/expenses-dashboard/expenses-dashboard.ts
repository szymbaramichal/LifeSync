import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { ExpensesTopBar } from "../expenses-top-bar/expenses-top-bar";
import { ExpensesList } from '../expenses-list/expenses-list';
import { ExpensesUpsert } from "../expenses-upsert/expenses-upsert";

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
    ExpensesList,
    ExpensesUpsert
],
  templateUrl: './expenses-dashboard.html',
  styleUrl: './expenses-dashboard.css',
})
export class ExpensesDashboard {
  selectedGroupId = signal<string>('');
  expensesRefreshVersion = signal(0);

  onGroupChange($event: string): void {
    this.selectedGroupId.set($event);
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index !== 0 || !this.selectedGroupId()) {
      return;
    }

    this.expensesRefreshVersion.update(version => version + 1);
  }
}
