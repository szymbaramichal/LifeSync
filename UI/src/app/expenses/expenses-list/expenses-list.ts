import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExpenseDto } from '../expenses.models';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-expenses-list',
  imports: [],
  templateUrl: './expenses-list.html',
  styleUrl: './expenses-list.css',
})
export class ExpensesList implements OnChanges {
  @Input() groupId: string | null = null;

  private destroyRef = inject(DestroyRef);
  private expensesService = inject(ExpensesService);

  expenses = signal<ExpenseDto[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['groupId']) {
      return;
    }

    if (!this.groupId) {
      this.expenses.set([]);
      return;
    }

    this.expensesService
      .getExpenses(this.groupId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (expenses) => this.expenses.set(expenses),
      });
  }
}
