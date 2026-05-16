import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabChangeEvent, MatTabGroup, MatTab } from '@angular/material/tabs';
import { ExpensesTopBar } from "../../components/expenses/expenses-top-bar/expenses-top-bar";
import { ExpensesList } from '../../components/expenses/expenses-list/expenses-list';
import { ExpensesUpsert } from "../../components/expenses/expenses-upsert/expenses-upsert";
import { CreateGroup } from "../../components/groups/create-group/create-group";
import { JoinGroup } from "../../components/groups/join-group/join-group";

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
    ExpensesUpsert,
    CreateGroup,
    JoinGroup
],
  templateUrl: './expenses-dashboard.html',
  styleUrl: './expenses-dashboard.css',
})
export class ExpensesDashboard {
  selectedGroupId = signal<string>('');
  isGroupCreateMode = signal(false);
  isGroupJoinMode = signal(false);
  expensesRefreshVersion = signal(0);

  onGroupChange($event: string): void {
    if ($event === 'create') {
      this.selectedGroupId.set('');
      this.isGroupJoinMode.set(false);
      this.isGroupCreateMode.set(true);
      return;
    }
    else if ($event === 'join') {
      this.isGroupJoinMode.set(true);
      this.selectedGroupId.set('');
      this.isGroupCreateMode.set(false);
      return;
    }
    else {
      this.selectedGroupId.set($event);
      this.isGroupCreateMode.set(false);
      this.isGroupJoinMode.set(false);

    }
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index !== 0 || !this.selectedGroupId()) {
      return;
    }

    this.expensesRefreshVersion.update(version => version + 1);
  }
}
