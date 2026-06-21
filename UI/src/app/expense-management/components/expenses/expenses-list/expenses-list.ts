import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ExpenseGroupStore } from '../../../expense-group.store';
import { ExpenseDto } from '../../../models/expenses.models';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expenses-list',
  imports: [MatTableModule, MatIconModule, MatButtonModule, CurrencyPipe],
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css',
})
export class ExpensesList implements OnInit {
  expenseGroupStore = inject(ExpenseGroupStore);

  dataSource = computed<ExpenseDto[]>(() => this.expenseGroupStore.expenses());

  columnsToDisplay: string[] = ['title', 'amount'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  expandedElement = signal<ExpenseDto | null>(null);

  ngOnInit(): void {
    this.expenseGroupStore.refreshExpenses();
  }

  toggle(element: ExpenseDto): void {
    this.expandedElement.update(current => current?.id === element.id ? null : element);
  }

  isExpanded(element: ExpenseDto): boolean {
    return this.expandedElement()?.id === element.id;
  }
}
