import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges, signal, effect } from '@angular/core';
import { ExpenseDto } from '../../../models/expenses.models';
import { ExpensesService } from '../../../services/expenses.service';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-expenses-list',
  imports: [],
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css',
})
export class ExpensesList {
  private expensesService = inject(ExpensesService);
  expenseGroupStore = inject(ExpenseGroupStore);

  expenses = signal<ExpenseDto[]>([]);

  constructor() {
    effect(() => {
      const groupId = this.expenseGroupStore.selectedGroupId();
      if (groupId === '')
        return;

      this.expensesService.getExpenses(groupId).subscribe((expenses) => {
        this.expenses.set(expenses);
      });
    })
  }
}
