import { Component, effect, inject, OnInit, output } from '@angular/core';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExpenseGroupStore } from '../expense-group.store';

@Component({
  selector: 'app-expenses-top-bar',
  imports: [
    MatSelect,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './expenses-top-bar.html',
  styleUrl: './expenses-top-bar.css',
})
export class ExpensesTopBar implements OnInit {
  expenseGroupChanged = output<string>();
  expenseGroupStore = inject(ExpenseGroupStore);

  selectedExpenseGroupId: string = '';

  constructor() {
    effect(() => {
      const groups = this.expenseGroupStore.groups();
      if (groups.length === 0) {
        return;
      }

      const hasSelectedGroup = groups.some((group) => group.id === this.selectedExpenseGroupId);
      const groupIdToEmit = hasSelectedGroup ? this.selectedExpenseGroupId : groups[0].id;

      if (groupIdToEmit !== this.selectedExpenseGroupId) {
        this.selectedExpenseGroupId = groupIdToEmit;
        this.expenseGroupChanged.emit(groupIdToEmit);
      }
    });
  }

  ngOnInit(): void {
    this.expenseGroupStore.ensureLoaded();
  }

  onSelectedExpenseGroupIdChange(groupId: string): void {
    this.expenseGroupChanged.emit(groupId ?? '');
  }
}
