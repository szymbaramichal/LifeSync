import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges, signal, effect } from '@angular/core';
import { ExpenseGroupStore } from '../../../expense-group.store';

@Component({
  selector: 'app-expenses-list',
  imports: [],
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css',
})
export class ExpensesList {
  expenseGroupStore = inject(ExpenseGroupStore);
}
